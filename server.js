var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function (client) {
    console.log('have a connection');

    client.on('node-ready', function (data) {
        console.log(`node-ready: ${data}`);
    });
    client.on('disconnect', function () { });
});


client.on('live-stream', function (data) {
    client.emit('all-node-info', 'hello world');
    client.emit('node', data);
    console.log(`it is base64 !video!: ${data}`);
});

server.listen(3000);