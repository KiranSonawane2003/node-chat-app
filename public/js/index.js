var socket = io();  
                socket.on('connect', function()  {
                    console.log("Connected to server");

                    socket.on('newMessage', function(newMessage) {
                        console.log("newMessage from the Server\n", newMessage);
                    });
                }); 

                socket.on('disconnect', function() {
                    console.log("Disconnected from server.");
                });
