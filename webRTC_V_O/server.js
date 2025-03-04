const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('offer', (offer) => socket.broadcast.emit('offer', offer));
    socket.on('answer', (answer) => socket.broadcast.emit('answer', answer));
    socket.on('candidate', (candidate) => socket.broadcast.emit('candidate', candidate));
    socket.on('message', (message) => socket.broadcast.emit('message', message));
});

server.listen(7410, () => console.log('Server running on port 7410'));
