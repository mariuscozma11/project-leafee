const http = require("http");
const { WebSocketServer } = require("ws");

const clients = new Set();

function broadcastMessage(msg) {
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(msg);
    }
  });
}

function startWebSocketServer(port = 3000) {
  const server = http.createServer();
  const wss = new WebSocketServer({ server });

  console.log(`Server WebSocket (ws) pornit pe portul ${port}`);

  wss.on("connection", (ws) => {
    console.log("Client nou conectat.");
    clients.add(ws);

    ws.on("message", (messageBuffer) => {
      const messageString = messageBuffer.toString();
      console.log(`Mesaj primit: ${messageString}`);
      broadcastMessage(messageString);
    });

    ws.on("close", () => {
      console.log("Client deconectat.");
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("Eroare WS:", error);
      clients.delete(ws);
    });
  });

  server.listen(port, () => {
    console.log(`WebSocket server asculta pe portul ${port}`);
  });
}

module.exports = { startWebSocketServer, broadcastMessage };