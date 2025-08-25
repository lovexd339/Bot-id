module.exports = function (api, event) {
  const helpText = `
📘 Available Commands:
!lock <group name> – Lock group name and nickname
!unlock – Unlock current group
!info – Show group ID and your ID
!help – Show this help message
`;
  api.sendMessage(helpText, event.threadID);
};
