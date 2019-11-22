var spawn = require('child_process').spawn;

var cmd = 'ffmpeg';
//ffmpeg -f mjpeg -r 5 -i "http://localhost:8081/?action=stream" -r 5 ./video2.avi
var args = [
    '-f', 'mjpeg',
    '-r', '5',
    '-i', 'http://localhost:8081/?action=stream',
    '-r', '5',
    './video2.avi'
];
let i = 0;
setInterval(()=> {i++; console.log(i)}, 1000);
var proc = spawn(cmd, args);

proc.stdout.on('data', function(data) {
    console.log('stdout', data);
});

proc.stderr.on('data', function(data) {
//    console.log('stderr', data);
});

proc.on('close', function() {
    console.log('finished');
});
