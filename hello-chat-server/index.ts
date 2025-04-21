const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // you can specify your device IP later
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    // console.log("Received message:", data);
    io.emit("receive_message", data); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
  
  socket.on("webrtc_offer", ({ to, sdp }) => {
    socket.to(to).emit("webrtc_offer", { sdp });
  });
  
  socket.on("webrtc_answer", ({ to, sdp }) => {
    socket.to(to).emit("webrtc_answer", { sdp });
  });
  
  socket.on("ice_candidate", ({ to, candidate }) => {
    socket.to(to).emit("ice_candidate", { candidate });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
