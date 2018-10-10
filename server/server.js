const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const express = require("express");
const app = express();

var server = http.createServer(app);
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000 ; 
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log("New user /connected.")

    socket.on('disconnect', () => {
        console.log("User was /disconnected");
    });
    
});


server.listen(port, () => {
    console.log(`Server up on ${port}`);
});
