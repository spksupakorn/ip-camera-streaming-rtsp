const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const express = require('express');

// Create an Express app
const app = express();

app.use(cors());

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.IO server is running.\n');
});

// Attach Socket.IO to the server
const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins, adjust this as necessary for your use case
        methods: ['GET', 'POST'],
    }
});

// Handle connection event
io.on('connection', (socket) => {
    console.log('A client connected');

    // Handle incoming messages from clients
    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Send a message back to the client
        socket.send(`Server received: ${message}`);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Start the server
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});