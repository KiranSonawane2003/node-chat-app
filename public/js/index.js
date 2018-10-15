var socket = io();
socket.on('connect', function () {
    console.log("Connected to server");
});

socket.on('newMessage', function (newMessage) {
    console.log("newMessage \n", newMessage);
    var li = jQuery('<li></li>');
    li.text(`${newMessage.from}: ${newMessage.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);   
    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: "User",
        text: jQuery('[name = message]').val()
    }, function () {

    });

    $('#message-form')[0].reset();
});

socket.on('disconnect', function () {
    console.log("Disconnected from server.");
});

var locationButton = jQuery("#get-location");
locationButton.on('click', function() {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your Browser.");
    } 

    locationButton.attr('disabled', 'disabled').text("Sending location...")

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text("Send location");
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude , 
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text("Send location");
        console.log("Unable to find Geolocation.");
    });
});