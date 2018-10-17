const path = require("path");
const http = require("http");
const {generateMessage, generateLocationMessage} = require("./utils/messages")
const {Users} = require("./utils/users");
const {isRealString} = require("./utils/validation")
const socketIO = require("socket.io");
const express = require("express");
const app = express();

var server = http.createServer(app);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000 ; 
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {   
    console.log("\nNew user /connected.")

    
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
        return callback("Name And Room Name are required.");
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App.'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined.`));
        callback(); 
                                        
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id)
        

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage',(coords) => {
        var user = users.getUser(socket.id)
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    }); 

    socket.on('disconnect', () => {
        console.log("User was /disconnected");
        var user = users.removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room}.`) )

        }
    });
});

server.listen(port, () => {
    console.log(`Server up on ${port}`);
});

//socket.leave('The Office Fans');
                                        //io.emit ->    io.to('The Office Fans').emit
                                        //socket.broadcast.emit --> socket.broadcast.to('The Office fans').emit
                                        //socket.emit