/**
 * DEPRECATED
 */

let socket = require('socket.io-client')('http://10.164.0.2:3001');

const serverSender = require('http').createServer();
const ioSender = require('socket.io')(serverSender);

socket.on('connect', function() {});

socket.on('disconect', function() {});

socket.on('error', function(e) {});

socket.on('node', data => {
  ioSender.compress(true).emit('view', data.toString('base64'));
});

serverSender.listen(3000);
