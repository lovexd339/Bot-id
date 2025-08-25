const login = require('fca-horizon-remake');
const fs = require('fs');
const config = require('./config.json');
const messageHandler = require('./handlers/messageHandler');

const appState = require('./appstate.json');

login({ appState }, (err, api) => {
  if (err) return console.error('Login Failed:', err);

  api.setOptions({
    forceLogin: true,
    listenEvents: true,
    selfListen: false,
    logLevel: "silent"
  });

  console.log('🤖 Bot is now online!');

  api.listenMqtt((err, event) => {
    if (err) return console.error(err);
    messageHandler(api, event);
  });
});
