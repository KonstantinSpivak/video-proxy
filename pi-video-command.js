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
pwm = new Pca9685Driver(options, function(err) {
  if (err) {
    console.error('Error initializing PCA9685');
    process.exit(-1);
  }
  console.log('Initialization done');

  // Set channel 0 to turn on on step 42 and off on step 255
  // (with optional callback)
  pwm.setPulseRange(0, 42, 255, function() {
    if (err) {
      console.error('Error setting pulse range.');
    } else {
      console.log('Pulse range set.');
    }
  });

  // Set the pulse length to 1500 microseconds for channel 2
  pwm.setPulseLength(1, 1500);
  pwm.setPulseLength(2, 1500);
  pwm.setPulseLength(3, 1500);
  pwm.setPulseLength(4, 1500);
  pwm.setPulseLength(5, 1500);
  // Set the duty cycle to 25% for channel 8
  pwm.setDutyCycle(8, 0.25);

  // Turn off all power to channel 6
  // (with optional callback)
  pwm.channelOff(6, function() {
    if (err) {
      console.error('Error turning off channel.');
    } else {
      console.log('Channel 6 is off.');
    }
  });

  // Turn on channel 3 (100% power)
  pwm.channelOn(3);
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
