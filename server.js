const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const path = require('path');
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*://localhost:3000/'
}))

app.use(express.static(path.join(__dirname, 'client')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

io.use((socket, next) => {
    let userName = socket.handshake.auth.name;
    console.log(socket.handshake);
    if (!userName) {
        throw Error("Error!")
    }
    socket.userName = userName;
    next();
})

io.on('connection', (socket) => {
    io.emit('connected new user', socket.userName)
    socket.on('disconnect', () => {
    })
    socket.on('new message', (data) => {
        io.emit('new message', {
            message: data.message,
            messageOwner: socket.userName,
            isOwner: socket.userName === data.messageOwner
        });
    })
})

server.listen(PORT, () => {
    console.log(`listening server on ${PORT}`)
})

