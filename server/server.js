const path = require("path");
const http = require("http");
const {generateMessage, generateLocationMessage} = require("./utils/messages")
const socketIO = require("socket.io");
const express = require("express");
const app = express();

var server = http.createServer(app);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000 ; 
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {   
    console.log("\n\nNew user /connected.")

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App.'));

    socket.broadcast.emit('newMessage', {   
        from: "Admin",
        text: "New user joined",
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message, callback) => {
        console.log("\n createMessage:  ", message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server');
    });

    socket.on('createLocationMessage',(coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
    });

    socket.on('disconnect', () => {
        console.log("User was /disconnected");
    });

})

server.listen(port, () => {
    console.log(`Server up on ${port}`);
}); 
