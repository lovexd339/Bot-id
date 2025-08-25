const login = require("facebook-chat-api");
const fs = require("fs");

// -------------------- CONFIG --------------------
let config = {
    adminUID: "100015786132744", // Replace with your UID
    prefix: "!",
    lockedNicknames: {},             // { threadID: { userID: nickname } }
    lockedGroupNames: {}             // { threadID: groupName }
};

// Load saved config
if (fs.existsSync("config.json")) {
    config = JSON.parse(fs.readFileSync("config.json"));
}

// Save config
function saveConfig() {
    fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
}

// -------------------- LOGIN --------------------
login({ appState: JSON.parse(fs.readFileSync("appstate.json", "utf8")) }, (err, api) => {
    if (err) return console.error("Login failed:", err);

    api.setOptions({ listenEvents: true });
    console.log("🤖 Bot is running...");

    api.listenMqtt((err, event) => {
        if (err) return console.error(err);

        const threadID = event.threadID;

        // -------------------- GROUP NAME LOCK --------------------
        if (event.type === "event" && event.logMessageType === "log:thread-name") {
            const newName = event.logMessageData.name;
            const lockedName = config.lockedGroupNames[threadID];
            if (lockedName && newName !== lockedName) {
                api.setTitle(lockedName, threadID, () => console.log(`🔁 Reverted group name`));
            }
        }

        // -------------------- NICKNAME LOCK --------------------
        if (event.type === "event" && event.logMessageType === "log:user-nickname") {
            const userID = event.logMessageData.participant_id;
            const newNick = event.logMessageData.nickname;

            if (config.lockedNicknames[threadID] && config.lockedNicknames[threadID][userID]) {
                const lockedNick = config.lockedNicknames[threadID][userID];
                if (newNick !== lockedNick) {
                    api.changeNickname(lockedNick, threadID, userID, () => 
                        console.log(`🔁 Reverted nickname for ${userID}`));
                }
            }
        }

        // -------------------- ADMIN COMMANDS --------------------
        if (event.type === "message" && event.body && event.senderID === config.adminUID) {
            const body = event.body;
            if (!body.startsWith(config.prefix)) return;

            const args = body.slice(config.prefix.length).trim().split(/ +/);
            const cmd = args.shift().toLowerCase();

            switch(cmd) {
                case "locknick":
                    const [uid, ...nickParts] = args;
                    const nickname = nickParts.join(" ");
                    if (!config.lockedNicknames[threadID]) config.lockedNicknames[threadID] = {};
                    config.lockedNicknames[threadID][uid] = nickname;
                    saveConfig();
                    api.sendMessage(`✅ Locked nickname for ${uid} as "${nickname}"`, threadID);
                    break;

                case "nicknamelockall":
                    const nicknameAll = args.join(" ") || "Member"; // Default nickname
                    api.getThreadInfo(threadID, (err, info) => {
                        if (err) return console.error(err);
                        if (!config.lockedNicknames[threadID]) config.lockedNicknames[threadID] = {};
                        info.userInfo.forEach(user => {
                            config.lockedNicknames[threadID][user.id] = nicknameAll;
                            api.changeNickname(nicknameAll, threadID, user.id);
                        });
                        saveConfig();
                        api.sendMessage(`✅ Locked all members' nicknames as "${nicknameAll}"`, threadID);
                    });
                    break;

                case "unlocknick":
                    const target = args[0];
                    if (config.lockedNicknames[threadID]) {
                        delete config.lockedNicknames[threadID][target];
                        saveConfig();
                        api.sendMessage(`❌ Unlocked nickname for ${target}`, threadID);
                    }
                    break;

                case "lockgroupname":
                    const gname = args.join(" ");
                    config.lockedGroupNames[threadID] = gname;
                    saveConfig();
                    api.setTitle(gname, threadID);
                    api.sendMessage(`✅ Group name locked as "${gname}"`, threadID);
                    break;

                case "unlockgroupname":
                    delete config.lockedGroupNames[threadID];
                    saveConfig();
                    api.sendMessage(`❌ Group name unlocked`, threadID);
                    break;

                case "prefix":
                    const newPrefix = args[0];
                    config.prefix = newPrefix;
                    saveConfig();
                    api.sendMessage(`✅ Prefix changed to "${newPrefix}"`, threadID);
                    break;

                case "sendmessages":
                    if (event.mentions && Object.keys(event.mentions).length > 0) {
                        const targetUID = Object.keys(event.mentions)[0];
                        const messages = fs.readFileSync("messages.txt", "utf8")
                                         .split("\n")
                                         .filter(Boolean);

                        messages.forEach((msg, i) => {
                            setTimeout(() => {
                                api.sendMessage({
                                    body: msg,
                                    mentions: [{ id: targetUID, tag: "", fromIndex: 0 }]
                                }, threadID);
                            }, 10000 * i); // 10 seconds delay
                        });

                        api.sendMessage(`✅ Sending ${messages.length} messages with 10s delay.`, threadID);
                    } else {
                        api.sendMessage("⚠️ Please mention a user.", threadID);
                    }
                    break;

                default:
                    api.sendMessage("❌ Unknown command.", threadID);
            }
        }
    });
});
