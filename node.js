/**
 * NODE
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
let socket = require('socket.io-client')('http://10.164.0.2:3000');

socket.on('connect', function () {
    console.log('Connect');
});

socket.on('disconect', function () {
    console.log('disconect');
});

socket.on('error', function (e) {
    console.log('Error');
    console.log(e);
});


