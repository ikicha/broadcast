var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sender = io.of('/send');
var receiver = io.of('/receive');
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;
server.listen(port);
app.use(bodyParser.json())

// WARNING: app.listen(80) will NOT work here!

sender.on('connection', function(socket) {
    socket.on('notification', function(data) {
        receiver.emit('notification', data);
    })
});

app.post('/notification/:id', function(req, res) {
    const id = req.params.id;
    const body = req.body;
    if (!body) {
        return;
    }

    console.log(body);
    if (body.data && body.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent") {
        const ValidationResponse = body.data.validationCode;
        res.status(200).json({ValidationResponse})
        return;
    }

    receiver.emit('notification', { id, timestamp: Date.now() });
    res.sendStatus(200);
});

app.use('/', express.static('public'));