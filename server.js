var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function (client) {
    client.on('live-stream', function (data) {
        console.log(data);
    });
    client.on('disconnect', function () { });
});
server.listen(3000);