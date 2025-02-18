import { Server } from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    }
});

export function getReceiverSocketId(userId)  {
    return userSocketMap[userId];
}

//To store Online Users
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user has Connected...", socket.id);
    
    const userId = socket.handshake.query.userId;
    if(userId)
        {
            userSocketMap[userId] = socket.id;
            socket.userId = userId;
        } 
            

    io.emit("getOnlineUsers", Object.keys(userSocketMap));                              //used to send events to all the connected clients

    socket.on("disconnect", () => {
        console.log("A user has Disconnected...", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server }; 