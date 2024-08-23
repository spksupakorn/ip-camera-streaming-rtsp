const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors"); 
const Stream = require('node-rtsp-stream-jsmpeg');

const app = express();

require('dotenv').config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let rtsp_url = process.env.RTSP_URL;
const ws_port = process.env.WS_PORT || 9999;
const port = process.env.PORT || 8000;

let options = {
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

let stream = new Stream(options)

function restartStream() {
  console.log('\nRestarting stream...\n');
  
  // Stop the current stream
  stream.stop();
  
  // Wait for a few seconds before restarting
  setTimeout(() => {
    // Reinitialize the stream
    stream = new Stream(options);
    console.log('\nStream restarted.\n');
  }, 3000); // Adjust the timeout as needed
}

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + './public/index.html');
});

app.post('/stream/seturl', async (req, res) => {
  const { url } = req.body;
  console.log(`\n${url}\n`);
  rtsp_url = url;
  restartStream();
  res.send({ message: 'restart streaming success.' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  stream.start()

  stream.on('exitWithError', () => {
    console.log('Stream exited with error. Restarting...');
    stream.start();
  });
});