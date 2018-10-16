const path = require("path");
const http = require("http");
const {generateMessage, generateLocationMessage} = require("./utils/messages")
const {isRealString} = require("./utils/validation")
const socketIO = require("socket.io");
const express = require("express");
const app = express();

var server = http.createServer(app);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000 ; 
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {   
    console.log("\nNew user /connected.")

    
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            callback("Name And Room Name are required.");
        }

            socket.join(params.room);
            //socket.leave('The Office Fans');
            
            //io.emit ->    io.to('The Office Fans').emit
            //socket.broadcast.emit --> socket.broadcast.to('The Office fans').emit
            //socket.emit

            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App.'));
            socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined.`));
            callback(); 
    });

    socket.on('createMessage', (message, callback) => {
        console.log("\n createMessage:  ", message);

        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
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