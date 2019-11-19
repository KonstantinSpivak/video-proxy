//const socket = require('socket.io-client')('http://192.168.1.17:3003'); //http://52.148.215.164:3003
const socket = require('socket.io-client')('http://52.148.215.164:3003');
const v4l2camera = require('node-v4l2camera');

let isVideoStream = false;
socket.on('connect', function() {
  isVideoStream = true;
  console.log('Connect to the cloud remote server');
});

socket.on('disconnect', function() {
  isVideoStream = false;
  console.log('disconnect from cloud remote servdr');
});

socket.on('error', function(e) {
  console.log('Error', e);
});
socket.emit('live-stream', 'text send');

let cam = new v4l2camera.Camera('/dev/video0');
// console.log(cam.configGet());
// console.log(cam.configSet());

cam.configSet({
  formatName: 'MJPG',
  format: 1196444237,
  width: 640,
  height: 480,
  interval: { numerator: 1, denominator: 15 }
});

if (cam.configGet().formatName !== 'MJPG') {
  console.log('NOTICE: MJPG camera required', cam.configGet().formatName);
  process.exit(1);
}

cam.start();
let oneFrame = true;
cam.capture(function loop() {
  var frame = cam.frameRaw();
  if (isVideoStream) {
    socket.compress(true).emit('live-stream', new Buffer(frame));
    if(oneFrame === true)
      require("fs").createWriteStream("img/result.jpg").end(Buffer(frame));
    oneFrame = false;
  }
  cam.capture(loop);
});
