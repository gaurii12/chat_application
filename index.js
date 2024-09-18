
const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); 


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST'] 
    }
});


app.use(cors()); 

app.use(express.static(path.join(__dirname, '../../angular_project/chatlast/dist/chat-application')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../angular_project/chatlast/dist/chat-application', 'index.html'));
});


const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle new user joining
    socket.on('new-user-joined', (name) => {
        try {
            users[socket.id] = name;
            // Notify all users about the new user
            io.emit('user-joined', name);
            console.log(`${name} has joined the chat`);
        } catch (error) {
            console.error('Error handling new-user-joined event:', error);
        }
    });

    // Handle sending messages
    socket.on('send', (message) => {
        try {
            const senderName = users[socket.id];
            // Broadcast message to all users
            io.emit('receive', { message: message, name: senderName });
            console.log(`${senderName}: ${message}`);
        } catch (error) {
            console.error('Error handling send event:', error);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        try {
            const userName = users[socket.id];
            if (userName) {
                // Notify all users about the user leaving
                io.emit('user-left', userName);
                delete users[socket.id];
                console.log(`${userName} has left the chat`);
            }
        } catch (error) {
            console.error('Error handling disconnect event:', error);
        }
    });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});













