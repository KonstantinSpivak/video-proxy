let opts = {
    extraHeaders: {
        host: '35.204.119.24',
        connection: 'keep-alive',
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        accept: '*/*',
        referer: 'http://35.204.119.24',
        'accept-encoding': 'gzip, deflate, sdch',
        'accept-language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4',
        rovergo: 'ok'
    }
};
let socket = require('socket.io-client')('http://35.204.119.24:3000');

let v4l2camera = require("v4l2camera");
//

let isVideoStream = false;
socket.on('connect', function () {
    isVideoStream = true;
    console.log('Connect');
});

socket.on('disconect', function () {
    isVideoStream = false;
    console.log('disconect');
});

socket.on('error', function (e) {
    console.log('Error');
    console.log(e);
});
socket.emit('live-stream', 'hello me');

let cam = new v4l2camera.Camera("/dev/video0");
// console.log(cam.configGet());
// console.log(cam.configSet());
cam.configSet({ width: 320, height: 240, formatName: 'V4L2_PIX_FMT_MJPEG', format: 'V4L2_PIX_FMT_MJPEG' });
console.log(cam.configGet());
if (cam.configGet().formatName !== "MJPG") {
    console.log("NOTICE: MJPG camera required");
    console.log(cam.configGet().formatName);
    process.exit(1);
}
cam.start();
cam.capture(function (success) {
    var frame = cam.frameRaw();
    if (isVideoStream) {
        socket.emit('live-stream', frame.toString('base64'));
    }

    cam.stop();
});