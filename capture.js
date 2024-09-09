const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

exports.generateFilePath = async() => {
    return new Promise((resolve, reject) => {
        const outputDir = './public/snapshots';

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const now = new Date();
        const dateString = now.toISOString().split('T')[0];  // Extract date as YYYY-MM-DD
        const timeString = now.toTimeString().split(' ')[0].replace(/:/g, '');  // Extract time as HH-MM-SS
        const fileName = `snap${dateString}T${timeString}.jpg`; 
        const outputPath = `${outputDir}/${fileName}`;
        resolve({ outputPath, fileName });
    })
}

exports.captureSnapshot = async(rtspUrl, outputPath) => {
    return new Promise((resolve, reject) => {
    ffmpeg(rtspUrl)
        .frames(1)            // Capture 1 frame
        .output(outputPath)    // Save to the output file
        .on('end', () => {
            try {
                // console.log('Snapshot captured and saved to:', outputPath);
                // resolve(outputPath);

                const stats = fs.statSync(outputPath);
                const fileSizeInBytes = stats.size;
                // console.log(`File size: ${fileSizeInBytes} bytes`);
                resolve(fileSizeInBytes);
            } catch (error) {
                console.error('Error getting file size:', error);
                reject(null);
            }
        })
        .on('error', (err) => {
            console.error('Error capturing snapshot:', err.message);
            reject(null);
        })
        .run();
    });
}


