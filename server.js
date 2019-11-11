const serverReciver = require('http').createServer();
const ioReciver = require('socket.io')(serverReciver);
const serverSender = require('http').createServer();
const ioSender = require('socket.io')(serverSender);
ioSender.on('connection', client => {
  let socketId = client.id;
  console.log('connect client:', socketId);
  client.emit('memo', client.id);

  client.on('preMemo', function(preMemo) {
    console.log('preMemo:', preMemo);
  });
  client.on('disconnect', function() {
    console.log('disconnect client:', socketId);
  });
});
ioReciver.on('connection', function(client) {
  console.log('#node_streamer_connected');
  client.on('live-stream', function(data) {
    //console.log(data);
    ioSender.compress(true).emit('node', data);
    // ioSender.compress(true).emit('node', data.toString('base64'));
  });
  client.on('disconnect', function() {
    console.log('#node_streamer_disconected');
  });
});
serverReciver.listen(3000);
serverSender.listen(3001);
