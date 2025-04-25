import { io } from "socket.io-client";

const socket = io("http://192.168.10.7:3000", {
    transports: ["websocket"],
    forceNew: false,
    autoConnect: false
});

// Store current user ID for reference
let currentUserId: any = null;

export const connectSocket = (userId) => {
  if (!userId) return;
  
  currentUserId = userId;
  
  if (!socket.connected) {
    socket.connect();
    
    socket.on('connect', () => {
      console.log('Socket connected, registering user:', userId);
      // Register user ID with server AFTER connection
      socket.emit('register_user', { userId });
    });
  } else {
    // If already connected, just register
    socket.emit('register_user', { userId });
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

export const getCurrentUserId = () => currentUserId;
export default socket;