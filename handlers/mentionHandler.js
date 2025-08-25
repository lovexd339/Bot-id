const config = require('../config.json');

module.exports = function (api, event) {
  const { threadID } = event;

  api.sendMessage(`📣 Mention detected! This bot is controlled by ${config.ownerName}`, threadID);
};
