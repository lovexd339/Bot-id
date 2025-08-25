const fs = require('fs');
const locksFile = './data/locks.json';
const config = require('../config.json');

module.exports = function (api, event) {
  const { threadID, senderID } = event;

  if (senderID !== config.adminID) {
    return api.sendMessage("⛔ Only admin can unlock.", threadID);
  }

  const locks = JSON.parse(fs.readFileSync(locksFile, 'utf8') || '{}');
  delete locks[threadID];
  fs.writeFileSync(locksFile, JSON.stringify(locks, null, 2));

  api.sendMessage("✅ Lock removed from this group.", threadID);
};
