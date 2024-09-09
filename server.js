const express = require('express');
const fs = require('fs');
const cron = require('node-cron');
const { uploadImage, deleteImage } = require('./controllers/uploadController');
const { generateFilePath, captureSnapshot }= require('./capture');

const app = express();

require('dotenv').config();

const port = process.env.PORT || 8000;

const rtspUrl = process.env.RTSP_URL;

// Schedule the task to run every 30 seconds
cron.schedule('*/30 * * * * *', () => {
  const retryCapture = async () => {
    const { outputPath , fileName } = await generateFilePath();
    const fileSize = await captureSnapshot(rtspUrl, outputPath);
    if (fileSize < 380 * 1000) {
      fs.unlink(outputPath, (err) => {
        if (err) {
            console.error('Error deleting the file:', err);
            return;
        }
      });

      retryCapture();
    } else {
      await uploadImage(fileName);
      return;
      // console.log('Snapshot saved:', outputPath);
    }
  }

  retryCapture();
});

// Schedule the function to run every day at midnight (server time)
cron.schedule('0 0 * * *', () => {
  deleteImage();
});

// app.use('/api/upload', uploadRoute);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});