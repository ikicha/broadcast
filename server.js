var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sender = io.of('/send');
var receiver = io.of('/receive');

var port = process.env.PORT || 8080;
server.listen(port);

// WARNING: app.listen(80) will NOT work here!

sender.on('connection', function(socket) {
    socket.on('notification', function(data) {
        receiver.emit('notification', data);
    })
});

app.use('/', express.static('public'));