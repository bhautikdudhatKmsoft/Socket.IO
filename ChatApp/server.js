const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const port = 7410

const app = express();
const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.broadcast.emit('chat message', 'A new user has joined the chat');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        socket.broadcast.emit('chat message', 'A user has left the chat');
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
