import { io } from "socket.io-client";

const socket = io("http://192.168.10.7:3000", {
    transports: ["websocket"],
    forceNew: false,
    autoConnect: false
});

export default socket;