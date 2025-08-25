const express = require("express");
const app = express();

// ✅ Bot को load कर लिया
require("./locker.js");

// Homepage route (Render को चाहिए alive server)
app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

// Server start
app.listen(3000, () => {
  console.log("Web server started on port 3000");
});
