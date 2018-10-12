const path = require("path");
const http = require("http");
const {generateMessage} = require("./utils/messages")
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

    socket.on('createMessage', (message) => {
        console.log("createMessage event is received from the client\n\n", message);

        io.emit('newMessage', {
            from: message.from,
            message: message.message,
            createdAt: new Date().getTime()
        });

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     message: message.message,
        //     createdAt: new Date().getTime()
        // });

    });
    socket.on('disconnect', () => {
        console.log("User was /disconnected");
    });
    
})

server.listen(port, () => {
    console.log(`Server up on ${port}`);
});
