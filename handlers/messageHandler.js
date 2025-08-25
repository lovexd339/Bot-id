const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const mentionHandler = require('./mentionHandler');

module.exports = async function (api, event) {
  const { body, senderID, threadID, mentions } = event;

  if (mentions && Object.keys(mentions).length > 0) {
    mentionHandler(api, event);
  }

  if (!body || !body.startsWith(config.prefix)) return;

  const args = body.slice(config.prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const commandPath = path.join(__dirname, '..', 'commands', `${commandName}.js`);
  if (fs.existsSync(commandPath)) {
    const command = require(commandPath);
    command(api, event, args);
  }
};
