var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function (client) {
    console.log('have a connection');
    client.emit('all-node-info', 'hello');
    client.on('live-stream', function (data) {
        client.emit('node', data);
    });
    client.on('node-ready', function (data) {
        console.log(`node-ready: ${data}`);
    });
    client.on('disconnect', function () { });
});
server.listen(3000);