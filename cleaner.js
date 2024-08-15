const findRemoveSync = require('find-remove')

setInterval(() => {
    var result = findRemoveSync('./hls', { age: { seconds: 30 }, extensions: '.ts' });
    console.log(result);
}, 5000);

// const cron = require('node-cron');
// const fs = require('fs');
// const path = require('path');
// const { promisify } = require('util');

// const readdir = promisify(fs.readdir);
// const stat = promisify(fs.stat);
// const unlink = promisify(fs.unlink);

// const hlsDir = path.join(__dirname, 'hls');

// // Function to check if a file is currently in use
// async function isFileInUse(filePath) {
//   try {
//     await fs.promises.open(filePath, 'r'); // Try to open the file for reading
//     return false; // If open is successful, file is not in use
//   } catch (err) {
//     if (err.code === 'EBUSY') {
//       return true; // File is in use
//     }
//     return false; // Other errors, assume file is not in use
//   }
// }

// // Schedule task to run every hour
// cron.schedule('*/10 * * * *', async () => {
//   try {
//     const files = await readdir(hlsDir);
//     const now = Date.now();
//     const oneHour = 60 * 60 * 1000;

//     for (const file of files) {
//       const filePath = path.join(hlsDir, file);
//       const stats = await stat(filePath);

//       // Check if the file is older than one hour
//       if (now - stats.mtimeMs > oneHour) {
//         // Check if the file is currently in use
//         if (!(await isFileInUse(filePath))) {
//             await unlink(filePath);
//             console.log(`Deleted ${filePath}`);
//         } else {
//           console.log(`Skipped ${filePath} (in use)`);
//         }
//       }
//     }
//   } catch (err) {
//     console.error('Error during cleanup:', err);
//   }
// });
