var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var sender = io.of('/send');
var receiver = io.of('/receive');
var bodyParser = require('body-parser');
const { remoteControl } = require('./iothubService');

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
    if (!req.body) {
        return;
    }

    console.log(req.body);
    for (var i in req.body) {
        const body = req.body[i];
        if (body.data && body.eventType == "Microsoft.EventGrid.SubscriptionValidationEvent") {
            const ValidationResponse = body.data.validationCode;
            res.status(200).json({ValidationResponse})
            console.log({ValidationResponse})
            return;
        }
    }

    receiver.emit('notification', { id, timestamp: Date.now() });
    res.sendStatus(200);
    console.log({id, timestamp: Date.now()});
});

app.post('/update', function (req, res) {
    if (!req.body || req.body.status === undefined) {
        res.sendStatus(400);
        return;
    }
    remoteControl(req.body.status)
        .then(result => res.status(200).json(result))
        .catch(err => res.status(400).send(err));
});

app.use('/', express.static('public'));