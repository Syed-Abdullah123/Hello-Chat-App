import { io } from "socket.io-client";

const socket = io("http://192.168.10.7:3000", {
    transports: ["websocket"],
    forceNew: false,
    autoConnect: false
});

export default socket;

// Store current user ID for reference
let currentUserId = null;

export const connectSocket = (userId) => {
  currentUserId = userId;
  if (!socket.connected) {
    socket.connect();
    
    // Register user ID with server
    socket.emit('register_user', { userId });
    
    console.log('Socket connecting with user ID:', userId);
  }
};

export const disconnectSocket = () => {
  socket.disconnect();
  currentUserId = null;
};

export const initiateCall = (receiverId, callType, caller) => {
  console.log('Initiating call to:', receiverId, 'type:', callType);
  socket.emit('initiate_call', {
    to: receiverId,
    callType,
    caller
  });
};

export const acceptCall = (callerId) => {
  console.log('Accepting call from:', callerId);
  socket.emit('accept_call', {
    to: callerId
  });
};

export const rejectCall = (callerId) => {
  console.log('Rejecting call from:', callerId);
  socket.emit('reject_call', {
    to: callerId
  });
};

export const endCall = (receiverId) => {
  console.log('Ending call with:', receiverId);
  socket.emit('end_call', {
    to: receiverId
  });
};