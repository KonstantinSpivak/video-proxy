/**
 * NODE
 */

let socket = require('socket.io-client')('http://10.164.0.2:3001');

socket.on('connect', function () {
    console.log('Connect');
    //socket.emit('node-ready', '1');
});

socket.on('disconect', function () {
    console.log('disconect');
});

socket.on('error', function (e) {
    console.log('Error');
    console.log(e);
});

// socket.on('all-node-info', (data) => {
//     console.log(`all node info ${data}`);
// })

socket.on('node', (data) => {
    console.log(`it is base64 video: ${data}`);
})