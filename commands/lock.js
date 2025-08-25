const fs = require('fs');
const locksFile = './data/locks.json';
const config = require('../config.json');

module.exports = function (api, event, args) {
  const { threadID, senderID } = event;

  if (senderID !== config.adminID) {
    return api.sendMessage("⛔ Only admin can use this command.", threadID);
  }

  const locks = JSON.parse(fs.readFileSync(locksFile, 'utf8') || '{}');
  locks[threadID] = {
    groupName: args.join(' ') || 'LOCKED',
    nicknames: true
  };
  fs.writeFileSync(locksFile, JSON.stringify(locks, null, 2));

  api.setTitle(locks[threadID].groupName, threadID);
  api.sendMessage(`🔒 Group name and nickname lock enabled.\nGroup renamed to: ${locks[threadID].groupName}`, threadID);
};
