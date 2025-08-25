const fs = require('fs');
const path = './data/locks.json';

function getLocks() {
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function saveLocks(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { getLocks, saveLocks };
