require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const axios = require('axios');

const port = process.env.PORT || 1234;
const app = express();

app.use(express.json());

async function main() {
    await mongoose.connect(process.env.MONGODB);
}

main()
    .then(() => console.log('DB is connected.........'))
    .catch(err => console.log(err.message));

const mainRoute = require('./routes/user.routes');
app.use('/api', mainRoute);

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const users = {};

io.on('connection', async (socket) => {
    let userId = socket.id;
    users[userId] = userId;
    socket.emit('user connected', userId);

    try {
        await axios.post('http://localhost:7410/api/add-user', { userId });
    } catch (error) {
        console.error('Error adding user:', error.message);
    }

    socket.on('update user id', async (newUserId) => {
        if (!newUserId || users[newUserId]) return;
        
        try {
            await axios.put(`http://localhost:7410/api/update-user?UID=${userId}`, { newUserId });
            users[newUserId] = newUserId;
            delete users[userId];
            userId = newUserId;
            socket.emit('user id updated', newUserId);
        } catch (error) {
            console.error('Error updating user ID:', error.message);
        }
    });

    socket.on('chat message', async (msg) => {
        io.emit('chat message', `${userId}: ${msg}`);
        try {
            await axios.put(`http://localhost:7410/api/update-user?UID=${userId}`, {
                chats: msg,
                pushData: true
            });
        } catch (error) {
            console.error('Error saving message:', error.message);
        }
    });

    socket.on('disconnect', async () => {
        delete users[userId];
        const leaveDate = new Date().toISOString().split('T')[0];
        const leaveTime = new Date().toLocaleTimeString();
        try {
            await axios.put(`http://localhost:7410/api/update-user?UID=${userId}`, { leaveDate, leaveTime });
        } catch (error) {
            console.error('Error updating user:', error.message);
        }
        socket.broadcast.emit('chat message', `${userId} left the chat`);
    });
});

server.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
