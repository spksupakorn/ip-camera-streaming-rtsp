const express = require('express');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 8000;

const rtspUrl = process.env.RTSP_URL;

const { proxy } = require('rtsp-relay')(app);

const handler = proxy({
  url: rtspUrl,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: true,
});

app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + './public/index.html');
// });

app.ws('/api/stream', handler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});