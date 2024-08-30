const express = require("express");
const bodyParser = require("body-parser");
// const axios = require('axios');
const Stream = require('node-rtsp-stream-jsmpeg');
// const Stream = require('node-rtsp-stream');
const cors = require("cors");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

let stream = null;

let rtsp_url = process.env.RTSP_URL;
// const ng_url = process.env.NG_URL;
const ws_port = process.env.WS_PORT || 9999;

app.get("/api/v1/stream", (req, res) => {
  const feed = req.query.rtsp;
  console.log(`rtsp:${feed}\n`);

  let currentRtspStreamUrl = ""
  let newRtspStreamUrl = ""

  // axios.get(ng_url)
  //   .then(response => {
      // newRtspStreamUrl = response.data.result; 
      // newRtspStreamUrl = 'rtsp://admin:WIPS031202307210178@192.168.1.100:554/'; 
      newRtspStreamUrl = rtsp_url; 
      if (!stream || currentRtspStreamUrl !== newRtspStreamUrl) {
        if (!stream){
          let options = {
            name: 'Camera Stream',
            // streamUrl: newRtspStreamUrl,
            url: newRtspStreamUrl,
            wsPort: ws_port,
            ffmpegOptions: {
              '-stats': '', 
              '-r': 25,
              // '-s': '640x480',
              '-codec:v': 'mpeg1video',
              '-b:v': '1000k',
              '-an': ''
            },
          }
          
          stream = new Stream(options);
          stream.start();
          currentRtspStreamUrl = newRtspStreamUrl
        } else if (stream || feed === "stop") {
          stream.stop();
          stream = null;
        }
      }
    // })
    // .catch(error => {
    //   console.error(error);
    //   res.send(500).json({ 
    //     error: true,
    //     message: error.message 
    //   })
    // });
  // res.send(200).json({ url: `ws://127.0.0.1:9999` })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})