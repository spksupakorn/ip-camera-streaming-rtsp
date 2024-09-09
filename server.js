const express = require('express');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 8000;

const rtspUrl = process.env.RTSP_URL;

const { proxy } = require('rtsp-relay')(app);

const handler = proxy({
  url: rtspUrl,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
  additionalFlags: [
    '-vf', 'scale=1280:720',
    '-preset', 'fast',
    '-r', 24,                  
    '-q:v', 6,                 
    '-b:v', '2000K',            
    '-maxrate', '2000K',       
    '-bufsize', '4000K',
    '-b:a', '96K',
  ]
});

// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + './public/index.html');
// });

app.ws('/api/stream', handler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});