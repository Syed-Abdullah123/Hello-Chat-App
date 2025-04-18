import { io } from "socket.io-client";

const socket = io("https://192.168.10.7:3000");

export default socket;