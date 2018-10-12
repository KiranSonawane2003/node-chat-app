var socket = io();  
                socket.on('connect', function()  {
                    console.log("Connected to server");

                    // socket.emit('createMessage', {
                    //     from: "client",
                    //     message: "CreateMessage event sent from client to server."
                    // })

                    socket.on('newMessage', function(newMessage) {
                        console.log("newMessage from the Server", newMessage);
                    });
                }); 

                socket.on('disconnect', function() {
                    console.log("Disconnected from server.");
                });
