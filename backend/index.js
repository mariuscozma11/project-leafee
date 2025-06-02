const app = require("./app");
require('dotenv').config()
const { startWebSocketServer } = require('./websocket');

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

startWebSocketServer(3000);
