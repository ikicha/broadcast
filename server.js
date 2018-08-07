var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var callback = undefined;
var port = process.env.PORT || 8080;
server.listen(port);
// WARNING: app.listen(80) will NOT work here!

app.get('/noti/:id', function (req, res) {
    var id = req.params.id;
    io.sockets.emit('notification', { id, timestamp: Date.now()})
    res.sendStatus(200);
});

app.use('/', express.static('public'));