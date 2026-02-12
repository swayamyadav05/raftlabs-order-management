import { createServer } from "http";
import app from "./app.js";
import { setupWebSocket } from "./websocket/index.js";

const PORT = process.env.PORT || 3000;

const server = createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket available on ws://localhost:${PORT}`);
});
