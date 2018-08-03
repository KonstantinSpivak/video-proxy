var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function (client) {
    console.log('have a connection');

    io.on('node-ready', function (data) {
        console.log(`node-ready: ${data}`);
    });
    io.on('disconnect', function () { });
});


io.on('live-stream', function (data) {
    io.emit('all-node-info', 'hello world');
    io.emit('node', data);
    console.log(`it is base64 !video!: ${data}`);
});

server.listen(3000);