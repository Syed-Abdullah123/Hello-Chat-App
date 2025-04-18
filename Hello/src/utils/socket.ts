import { io } from "socket.io-client";

const socket = io("http://192.168.10.7:3000", {
    transports: ["websocket"],
    forceNew: false,
    reconnection: true
});

export default socket;