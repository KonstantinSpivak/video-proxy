const serverReciver = require('http').createServer();
const ioReciver = require('socket.io')(serverReciver);

const serverSender = require('http').createServer();
const ioSender = require('socket.io')(serverSender);

ioReciver.on('connection', function(client) {
  console.log('#node_streamer_connected');
  client.on('live-stream', function(data) {
    // ioSender.compress(true).emit('node', data);
  });

  client.on('disconnect', function() {
    console.log('#node_streamer_disconected');
  });
});

serverReciver.listen(3000);
serverSender.listen(3001);
