require('dotenv').config({ path: "./process.env" });
const mysql = require('mysql');
process.env.AWS_SDK_LOAD_CONFIG = '1'; // Enable loading of AWS SDK config
process.env.AWS_PROFILE = 'COSC499_CapstonePowerUserAccess-466618866658'; 
const { KinesisVideo } = require('@aws-sdk/client-kinesis-video');
const express = require('express');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temporarily store files in 'uploads' folder
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const ffmpegStatic = require('ffmpeg-static');
const path = require('path');
const PostDao = require('../dao/PostDao'); 
const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});
const postDao = new PostDao(connection);
// This will give you the path to the FFmpeg binary
const ffmpegPath = ffmpegStatic;

// You can then use this path with fluent-ffmpeg or any other library that requires FFmpeg
const ffmpeg = require('fluent-ffmpeg');
const { error } = require('console');
ffmpeg.setFfmpegPath(ffmpegPath);

// Initialize the S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

// Initialize Kinesis Video Client
const kinesisVideoClient = new KinesisVideo({
    region: process.env.AWS_REGION || 'us-east-1',
    // other configurations if needed
});

// Function to obtain temporary AWS credentials
async function getTemporaryCredentials() {
    const stsClient = new STSClient({ region: 'us-east-1' });
    const assumeRoleCommand = new AssumeRoleCommand({
        RoleArn: 'arn:aws:iam::466618866658:role/web-rtc-499',
        RoleSessionName: 'WebClientSession',
        // Add other required parameters if necessary
    });

    try {
        const data = await stsClient.send(assumeRoleCommand);
        return data.Credentials;
    } catch (error) {
        console.error('Error assuming role:', error);
        throw error;
    }
}

// Route handler to provide temporary credentials to the client
router.get('/get-temp-credentials', async (req, res) => {
    try {
        const credentials = await getTemporaryCredentials();
        if (credentials) {
            res.json({
                accessKeyId: credentials.AccessKeyId,
                secretAccessKey: credentials.SecretAccessKey,
                sessionToken: credentials.SessionToken,
                expiration: credentials.Expiration
            });
        } else {
            throw new Error('No credentials returned from assume role operation');
        }
    } catch (error) {
        console.error('Error assuming role:', error);
        res.status(500).json({ error: 'Error obtaining temporary credentials', details: error.toString() });
    }
});

// Route handler to provide signaling channel configuration to the client
router.get('/getSignalingChannelConfig', async (req, res) => {
    const channelARN = req.query.channelARN;
    
    try {
        const params = {
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: ['WSS', 'HTTPS'],
                Role: 'VIEWER',
            },
        };
        const endpointResponse = await kinesisVideoClient.getSignalingChannelEndpoint(params);

        // Extract the endpoints
        const endpointsByProtocol = endpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
        }, {});

        res.json({ endpointsByProtocol });
    } catch (error) {
        console.error('Error fetching signaling channel config:', error);
        res.status(500).json({ error: error.message });
    }
});


router.post('/upload-video', upload.single('video'), async (req, res) => {
    try {
        const file = req.file;
        const dirPath = path.join(__dirname, '../temp_videos/videos');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        } else {
            console.log("Directory exists:", dirPath);
        }

        const mp4FileName = `${Date.now()}_converted.mp4`;
        const mp4FilePath = path.join(dirPath, mp4FileName); // Use absolute path
        const s3Key = "videos/" + mp4FileName;
        // Convert video to MP4 using FFmpeg
        await new Promise((resolve, reject) => {
            ffmpeg(file.path)
                .output(mp4FilePath)
                .on('end', resolve)
                .on('error', (err) => {
                    console.error("FFmpeg error:", err);
                    reject(err);
                })
                .toFormat('mp4')
                .run();
        });


        // Read the converted MP4 file
        const fileStream = fs.createReadStream(mp4FilePath);

        const uploadParams = {
            Bucket: "cosc499-video-submission",
            Key: s3Key,
            Body: fileStream,
            ContentType: 'video/mp4',
            ContentDisposition: 'attachment'
        };

        const data = await s3Client.send(new PutObjectCommand(uploadParams));

        // Delete the original and converted files from local storage after uploading
        fs.unlinkSync(file.path);
        fs.unlinkSync(mp4FilePath);

        res.status(200).json({ message: 'Video uploaded successfully', 
        data,
        key: s3Key
    });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'Error uploading video', details: error.toString() });
    }
});
router.get('/get-video-url/:videoId', (req, res) => {
    const videoId = req.params.videoId;
    
    postDao.getVideoByKey(videoId, (err, videoKey, faceblur) => {
        if (err) {
            console.error('Error in /get-video-url/:videoId:', err);
            return res.status(500).json({ error: `Error getting video URL: ${err.message}` });
        }

        if (!videoKey) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Choose the bucket based on the faceblur value
        const bucketName = faceblur ? "cosc-499-blurvideo" : "cosc499-video-submission";

        // Generate a signed URL for accessing the video
        const s3Client = new S3Client({ region: "us-east-1" });
        const urlParams = { Bucket: bucketName, Key: videoKey }; // Use the chosen bucket name here
        const command = new GetObjectCommand(urlParams);

        getSignedUrl(s3Client, command, { expiresIn: 3600 })
            .then(signedUrl => {
                res.json({ signedUrl, faceblur }); // Optionally return the faceblur value if needed on the client side
            })
            .catch(signedUrlErr => {
                console.error('Error generating signed URL:', signedUrlErr);
                res.status(500).json({ error: `Error generating signed URL: ${signedUrlErr.message}` });
            });
    });
});




module.exports = router;
