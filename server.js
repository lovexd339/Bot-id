const express = require("express");
const app = express();

// ✅ Bot को load कर लिया
require("./locker.js");

// Homepage route
app.get("/", (req, res) => {
  res.send("Bot is running ✅");
});

// Server start
const PORT = process.env.PORT || 3000;  // Render के लिए जरूरी
app.listen(PORT, () => {
  console.log(`Web server started on port ${PORT}`);
});
