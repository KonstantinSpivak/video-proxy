//const socket = require('socket.io-client')('http://192.168.1.17:3003'); //http://52.148.215.164:3003
const socket = require('socket.io-client')('http://52.148.215.164:3003');
const v4l2camera = require('node-v4l2camera');
const i2cBus = require('i2c-bus');
const Pca9685Driver = require('pca9685').Pca9685Driver;
const options = {
  i2c: i2cBus.openSync(1),
  address: 0x40,
  frequency: 50,
  debug: false
};
const pulseLengths = [1300, 1500, 1700];
const steeringChannel = 4;


// variables used in servoLoop
const pwm;
let nextPulse = 0;
let timer;
function servoLoop() {
  timer = setTimeout(servoLoop, 500);

  pwm.setPulseLength(steeringChannel, pulseLengths[nextPulse]);
  nextPulse = (nextPulse + 1) % pulseLengths.length;
}
pwm = new Pca9685Driver(options, function(err) {
  if (err) {
    console.error('Error initializing PCA9685');
    process.exit(-1);
  }
  console.log('Initialization done');

  // Set channel 0 to turn on on step 42 and off on step 255
  // (with optional callback)
  servoLoop();
});

let isVideoStream = false;

socket.on('connect', function() {
  isVideoStream = true;
  console.log('Connect to the cloud remote server');
});

socket.on('disconnect', function() {
  isVideoStream = false;
  console.log('disconnect from cloud remote servdr');
});
socket.on('user_game', function(data) {
  setTimeout(() => {
    socket.emit('isWin', data);
  }, 7000);
  console.log('set user_game', data);
});
socket.on('commands', function(data) {
  console.log('commands', data);
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

//fileStream = new Stream.Readable();
cam.start();
let oneFrame = true;
cam.capture(function loop() {
  var frame = cam.frameRaw();
  if (isVideoStream) {
    socket.compress(true).emit('live-stream', Buffer(frame));

    //   if(oneFrame === true)
    //      require("fs").createWriteStream("img/result.jpg").end(Buffer(frame));
    //   oneFrame = false;
  }
  cam.capture(loop);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");

  if (timer) {
      clearTimeout(timer);
      timer = null;
  }

  pwm.dispose();
  cam.stop();
});
