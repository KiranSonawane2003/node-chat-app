var socket = io();
                socket.on('connect', function()  {
                    console.log("Connected to server");
                }); 

                socket.on('disconnect', function() {
                    console.log("Disconnected from server.");
                });

                socket.on('newEmail', function(newEmail) {
                    console.log("New Email", newEmail);
                })

