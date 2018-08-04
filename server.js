const serverReciver = require('http').createServer();
const ioReciver = require('socket.io')(serverReciver);

const serverSender = require('http').createServer();
const ioSender = require('socket.io')(serverSender);

ioReciver.on('connection', function (client) {
    console.log('have a connection');
    client.on('live-stream', function (data) {
        ioSender.compress(true).emit('node', data);
    });
    client.on('node-ready', function (data) {
        console.log(`node-ready: ${data}`);
    });
    client.on('disconnect', function () { });
});


serverReciver.listen(3000);
serverSender.listen(3001);