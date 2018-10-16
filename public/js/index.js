var socket = io();

socket.on('connect', function () {
    console.log("Connected to server");
});

socket.on('newMessage', function (newMessage) {
    var temp = jQuery("#message-template").html()
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var time = (`${hours}:${minutes}`)
    var html = Mustache.render(temp, {
        text: newMessage.text,
        from: newMessage.from,
        createdAt:time
    });

    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
    var temp = jQuery('#location-message-template').html()

    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var time = (`${hours}:${minutes}`)
    var html = Mustache.render(temp, {
        url: message.url,
        from: message.from,
        createdAt:time
    });

    jQuery('#messages').append(html);
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