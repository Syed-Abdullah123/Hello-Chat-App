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

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("register_user", ({ userId }) => {
    console.log(`User ${userId} registered with socket ${socket.id}`);
    connectedUsers.set(userId, socket.id);
    // Also store reverse lookup
    connectedUsers.set(socket.id, userId);
  });

  socket.on("send_message", (data) => {
    console.log("Received message:", data);
    io.emit("receive_message", data); // broadcast to all
  });

  socket.on("initiate_call", ({ to, callType, caller }) => {
    console.log(`Call initiated from ${caller.id} to ${to}, type: ${callType}`);
    const toSocketId = connectedUsers.get(to);
    
    if (toSocketId) {
      socket.to(toSocketId).emit("incoming_call", { callType, caller, from: socket.id });
    } else {
      // User offline or not found
      socket.emit("call_failed", { reason: "user_unavailable" });
    }
  });
  
  socket.on("accept_call", ({ to }) => {
    console.log(`Call accepted by ${socket.id} for ${to}`);
    const toSocketId = connectedUsers.get(to);
    
    if (toSocketId) {
      socket.to(toSocketId).emit("call_accepted", { from: socket.id });
    }
  });
  
  socket.on("reject_call", ({ to }) => {
    console.log(`Call rejected by ${socket.id} for ${to}`);
    const toSocketId = connectedUsers.get(to);
    
    if (toSocketId) {
      socket.to(toSocketId).emit("call_rejected", { from: socket.id });
    }
  });
  
  socket.on("end_call", ({ to }) => {
    console.log(`Call ended by ${socket.id} to ${to}`);
    const toSocketId = connectedUsers.get(to);
    
    if (toSocketId) {
      socket.to(toSocketId).emit("call_ended");
    }
  });
  
  socket.on("webrtc_offer", ({ to, sdp }) => {
    console.log(`WebRTC offer from ${socket.id} to ${to}`);
    const toSocketId = connectedUsers.get(to);
    
    if (toSocketId) {
      socket.to(toSocketId).emit("webrtc_offer", { sdp, from: socket.id });
    }
  });
  
  socket.on("webrtc_answer", ({ to, sdp }) => {
    console.log(`WebRTC answer from ${socket.id} to ${to}`);
    const toSocketId = connectedUsers.get(to);
    
    if (toSocketId) {
      socket.to(toSocketId).emit("webrtc_answer", { sdp, from: socket.id });
    }
  });
  
  socket.on("ice_candidate", ({ to, candidate }) => {
    const toSocketId = connectedUsers.get(to);
    
    if (toSocketId) {
      socket.to(toSocketId).emit("ice_candidate", { candidate, from: socket.id });
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    
    // Remove user from connected users map
    const userId = connectedUsers.get(socket.id);
    if (userId) {
      connectedUsers.delete(userId);
      connectedUsers.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
