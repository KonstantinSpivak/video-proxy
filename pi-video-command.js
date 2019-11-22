//const socket = require('socket.io-client')('http://192.168.1.17:3003'); //http://52.148.215.164:3003
const socket = require('socket.io-client')('http://52.148.215.164:3003');
const v4l2camera = require('node-v4l2camera');

let isVideoStream = false;
//send http
//const fs = require('fs');  // file system
const { PassThrough, Readable } = require('stream');
class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Every time there's data, push it into the internal buffer.
    this._source.ondata = (chunk) => {
      // If push() returns false, then stop reading from source.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // When the source ends, push the EOF-signaling `null` chunk.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() will be called when the stream wants to pull more data in.
  // The advisory size argument is ignored in this case.
  _read(size) {
    this._source.readStart();
  }
}

const  http = require('http');
let rsStream = new SourceWrapper();
//rsStream.read = function () {return '123'};
//rsStream.push('1');
var server = http.createServer(function (req, res) {
  // logic here to determine what file, etc
  //var rstream = fs.createReadStream('existFile');
//console.log(rsStream);
res.write('Hello World!'); //write a response to the client
rsStream.pipe(res);
//  res.end();
//  res.pipe(rsStream);
});
server.listen(8008, '127.0.0.1');

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

//fileStream = new Stream.Readable();
cam.start();
let oneFrame = true;
cam.capture(function loop() {
  var frame = cam.frameRaw();
 rsStream.push(Buffer(frame));
  if (isVideoStream) {
    socket.compress(true).emit('live-stream', Buffer(frame));
//    rsStream.push(data);
 //   if(oneFrame === true)
//      require("fs").createWriteStream("img/result.jpg").end(Buffer(frame));
 //   oneFrame = false;
  }
  cam.capture(loop);
});
