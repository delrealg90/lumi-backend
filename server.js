require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/streams", require("./src/routes/streamRoutes"));
app.use("/api/wallet", require("./src/routes/walletRoutes"));
app.use("/api/payments", require("./src/routes/paymentRoutes"));

// SOCKETS
require("./src/sockets/socket")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});