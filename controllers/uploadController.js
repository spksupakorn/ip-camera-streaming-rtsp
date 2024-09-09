// const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('../config/awsConfig');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const bucketName = process.env.BUCKET_NAME || 'chp-s3';

// exports.uploadImage = async (req, res) => {
exports.uploadImage = async (fileName) => {
    // const file = req.file;
    const filePath = path.join(__dirname, `../public/snapshots/${fileName}`);

    // Ensure file exists
    if (!fs.existsSync(filePath)) {
        console.error('Error: File does not exist at path:', filePath);
        return;
    }
    
    const fileStream = fs.createReadStream(filePath);

    // Upload file to S3
    const params = {
        // Bucket: 'chp-s3',
        // Key: `ebike/${file.originalname}`,
        // Body: file.buffer,
        Bucket: bucketName,
        Key: `ebike/${fileName}`,
        Body: fileStream,
    };

    const upload = new Upload({
        client: s3Client,
        params
    });

    upload.on('httpUploadProgress', (progress) => {
        // console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
    });

    try {
        await upload.done();
        // console.log('File uploaded successfully');
        // await s3Client.send(new PutObjectCommand(params));
        // res.send('File uploaded successfully');

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
            }
            // console.log('File deleted successfully from local');
        });
    } catch (err) {
        console.error(err);
        // res.status(500).send('Error uploading file to S3');
    }
};

exports.deleteImage = async () => {
    try {
        // List all files in the S3 bucket
        const listParams = {
            Bucket: bucketName,
            Prefix: 'ebike/',
        };
    
        const listResponse = await s3Client.send(new ListObjectsV2Command(listParams));
        const objects = listResponse.Contents || [];

        // Get the current date and time
        const now = new Date();
    
        // Filter files older than 3 days
        const objectsToDelete = objects.filter((object) => {
            const isImage = object.Key.endsWith('.jpg');
            const lastModified = new Date(object.LastModified);
            const ageInDays = (now - lastModified) / (1000 * 60 * 60 * 24);
            return ageInDays > 3 && isImage;
        });
        
        if (objectsToDelete.length === 0) {
            console.log('No files older than 3 days to delete.');
            return;
        }
    
        // Prepare the list of objects to delete
        const deleteParams = {
            Bucket: bucketName,
            Delete: {
                Objects: objectsToDelete.map((obj) => ({ Key: obj.Key })),
            },
        };
    
        // Delete the objects
        await s3Client.send(new DeleteObjectsCommand(deleteParams));
        // console.log('Deleted files:', deleteResponse.Deleted);
    } catch (err) {
        console.error('Error deleting files:', err);
    }
}