const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
require("dotenv").config();
let frontend = process.env.FRONTEND;

const io = socketIo(server, {
    cors: {
        origin: frontend, // Allow requests from this origin
        methods: "*",
        allowedHeaders: "*",
        credentials: true, // Allow cookies if needed
    },
});

// Socket.io connection handling
io.on("connection", (socket) => {
    // Handle message event from client
    socket.on("new_post", () => {
        // Broadcast the message to all connected clients
        console.log("new post");
        io.emit("new_post", {});
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
        console.log("A client disconnected");
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
