module.exports = function (api, event) {
  const { threadID, senderID } = event;

  api.sendMessage(`🆔 Group ID: ${threadID}\n👤 Your ID: ${senderID}`, threadID);
};
