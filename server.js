const express = require('express');
const Stream = require('node-rtsp-stream-jsmpeg');

const app = express();

require('dotenv').config();

const rtsp_url = process.env.RTSP_URL;
const ws_port = process.env.WS_PORT || 9999;
const port = process.env.PORT || 8000;

const options = {
  name: 'ip-camera',
  // url: 'rtsp://192.168.73.237/screenlive',
  url: rtsp_url,
  wsPort: ws_port,
  ffmpegOptions: {
    '-stats': '',
    '-r': 30,
    '-b:v': '2M', // Video bitrate (2 Mbps)
    '-bufsize': '4M', // Buffer size
    '-maxrate': '2M', // Maximum video bitrate
    '-b:a': '128k', // Audio bitrate (128 kbps)
    '-vf': 'scale=1280:720', // Set the output resolution to 720p
    '-c:v': 'libx264', // Video codec
    '-preset': 'fast', // Preset for encoding speed vs. compression ratio
    '-crf': '23', // Constant Rate Factor (lower values mean better quality)
  },
}

const stream = new Stream(options)

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + './public/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  stream.start()

  stream.on('exitWithError', () => {
    console.log('Stream exited with error. Restarting...');
    stream.start();
  });
});