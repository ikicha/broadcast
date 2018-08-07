var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var callback = undefined;
var port = process.env.PORT || 8080;
server.listen(port);
// WARNING: app.listen(80) will NOT work here!

app.get('/noti/:id', function (req, res) {
    console.log(req.params.id);
    if (callback) {
        callback(req.params.id);
    }
    res.sendStatus(200);
});

io.on('connection', function (socket) {
    callback = (id) => {
        socket.broadcast.emit('notification', { id, timestamp: Date.now()});
    }
});