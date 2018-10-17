var socket = io();

function scrollToBottom() {
//Selectors
var messages = jQuery("#messages");
var newMessage = messages.children('li:last-child');
//Heights

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }   else {
                    console.log("No Error");
        }
    });
}); 

socket.on('disconnect', function () {
    console.log("Disconnected from server.");
});

    socket.on('updateUsersList', function(users) {
        console.log('users', users);
        var ol = jQuery('<ol></ol>');

        users.forEach(user => {
                ol.append(jQuery('<li></li>').text(user));
        });
        jQuery('#users').html(ol);
    });

socket.on('newMessage', function (newMessage) {
    var template = jQuery("#message-template").html()
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var time = (`${hours}:${minutes}`);
    var html = Mustache.render(template, {
        text: newMessage.text,
        from: newMessage.from,
        createdAt:time
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
    var template = jQuery('#location-message-template').html()
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var time = (`${hours}:${minutes}`);
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt:time
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextBox = jQuery('[name = message]');

    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val();
    });

    $('#message-form')[0].reset();
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