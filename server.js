const http = require("http");
const PORT = process.env.PORT || 3000;

// Dummy HTTP server (Render ko lagna chahiye ki server chal raha hai)
http.createServer((req, res) => {
  res.end("FB Locker Bot is running!");
}).listen(PORT, () => console.log("Server running on port", PORT));

// Apna bot start karo
require("./locker.js");
