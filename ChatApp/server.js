// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');
// const port = 7410

// const app = express();
// const server = http.createServer(app);

// const io = socketIo(server);

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.broadcast.emit('chat message', 'A new user has joined the chat');

//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//     });

//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//         socket.broadcast.emit('chat message', 'A user has left the chat');
//     });
// });

// server.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


// const express = require('express');
// const http = require('http');
// const mqtt = require('mqtt');
// const path = require('path');

// const port = 7410;
// const mqttBrokerUrl = 'mqtt://localhost:1883';  // Change to 'mqtt://localhost' for local broker

// const app = express();
// const server = http.createServer(app);

// const chatTopic = 'chat/messages';
// const notifyTopic = 'chat/notifications';

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Connect to MQTT Broker
// console.log(`[SERVER] Connecting to MQTT Broker: ${mqttBrokerUrl}`);
// const mqttClient = mqtt.connect(mqttBrokerUrl);

// mqttClient.on('connect', () => {
//     console.log(`[MQTT] Connected to ${mqttBrokerUrl}`);
//     mqttClient.subscribe([chatTopic, notifyTopic], (err) => {
//         if (err) {
//             console.error(`[MQTT] Subscription Error: ${err}`);
//         } else {
//             console.log(`[MQTT] Subscribed to topics: ${chatTopic}, ${notifyTopic}`);
//         }
//     });
// });

// mqttClient.on('message', (topic, message) => {
//     console.log(`[MQTT] Received message on ${topic}: ${message.toString()}`);
// });

// // Handle user join
// app.get('/user-joined', (req, res) => {
//     console.log(`[USER] New user joined`);
//     mqttClient.publish(notifyTopic, `A new user has joined the chat`);
//     res.sendStatus(200);
// });

// // Handle user leave
// app.get('/user-left', (req, res) => {
//     console.log(`[USER] A user has left`);
//     mqttClient.publish(notifyTopic, `A user has left the chat`);
//     res.sendStatus(200);
// });

// // Send chat message
// app.get('/send-message', (req, res) => {
//     const msg = req.query.msg || 'Hello, MQTT!';
//     console.log(`[CHAT] Sending message: ${msg}`);
//     mqttClient.publish(chatTopic, msg);
//     res.send(`Message sent: ${msg}`);
// });

// server.listen(port, () => {
//     console.log(`[SERVER] Running at http://localhost:${port}`);
// });



const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const path = require('path');

const port = 7410;
const mqttBrokerUrl = 'mqtt://localhost:1883';

const app = express();
const server = http.createServer(app);

const chatTopic = 'chat/messages';
const notifyTopic = 'chat/notifications';
const userConnectedTopic = 'chat/userConnected';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MQTT Broker with V5 options
console.log(`[SERVER] Connecting to MQTT Broker: ${mqttBrokerUrl}`);
const mqttClient = mqtt.connect(mqttBrokerUrl, { protocolVersion: 5 });

mqttClient.on('connect', () => {
    console.log(`[MQTT] Connected to ${mqttBrokerUrl} with MQTT v5`);
    
    // Publish a message when the server itself connects
    mqttClient.publish(userConnectedTopic, 'Server connected to MQTT broker', { qos: 1, retain: false });

    // Subscribe to user connections topic
    mqttClient.subscribe(userConnectedTopic, (err) => {
        if (err) {
            console.error(`[MQTT] Subscription Error: ${err.message}`);
        } else {
            console.log(`[MQTT] Subscribed to user connection topic: ${userConnectedTopic}`);
        }
    });
});

// Handle messages
mqttClient.on('message', (topic, message) => {
    console.log(`[MQTT] Message Received -> Topic: ${topic}, Message: ${message.toString()}`);
});

// Handle new MQTT client connections by publishing a message
app.get('/user-joined', (req, res) => {
    const username = req.query.username || 'Unknown User';
    console.log(`[USER] New user connected: ${username}`);
    mqttClient.publish(userConnectedTopic, username);
    res.sendStatus(200);
});

// Handle user leaving
app.get('/user-left', (req, res) => {
    console.log(`[USER] A user has left`);
    mqttClient.publish(notifyTopic, `A user has left the chat`);
    res.sendStatus(200);
});

// Send chat message
app.get('/send-message', (req, res) => {
    const msg = req.query.msg || 'Hello, MQTT!';
    console.log(`[CHAT] Sending message: ${msg}`);
    mqttClient.publish(chatTopic, msg);
    res.send(`Message sent: ${msg}`);
});

// Log MQTT errors
mqttClient.on('error', (err) => {
    console.error(`[MQTT ERROR] ${err.message}`);
});

server.listen(port, () => {
    console.log(`[SERVER] Running at http://localhost:${port}`);
});
