const express = require('express');
const cors = require('cors');
const fluentFFmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// RTSP URL and HLS output directory
const rtspUrl = process.env.RTSP_URL;
const hlsOutputDir = path.join(__dirname, 'hls');

// Ensure the HLS output directory exists
if (!fs.existsSync(hlsOutputDir)) {
    fs.mkdirSync(hlsOutputDir);
}

// Function to start FFmpeg process
function startFFmpeg() {
    return new Promise((resolve, reject) => {
        const ffmpeg = fluentFFmpeg()
            .input(rtspUrl)
            .inputOptions('-rtsp_transport tcp')
            .output(path.join(hlsOutputDir, 'index.m3u8'))
            .outputOptions([
                '-fflags +genpts',
                '-vsync 0',
                '-preset veryfast',
                '-g 50',
                '-sc_threshold 0',
                '-codec:v libx264',
                '-codec:a aac',
                '-f hls',
                '-hls_time 2',
                '-hls_list_size 6',
                '-start_number 1'
            ])
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .run();
    });
}

// Start FFmpeg process
startFFmpeg()
    .then(() => {
        console.log('FFmpeg started successfully');
    })
    .catch((err) => {
        console.error('Error starting FFmpeg:', err);
    });

const corsOptions = {
    origin: "*",
};

// Serve HLS content
app.use('/hls', express.static(hlsOutputDir));
app.use(cors(corsOptions));

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/hls`);
});