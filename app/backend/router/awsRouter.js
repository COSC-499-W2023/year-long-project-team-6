require('dotenv').config({ path: "./process.env" });
process.env.AWS_SDK_LOAD_CONFIG = '1'; // Enable loading of AWS SDK config
process.env.AWS_PROFILE = 'botocore-client-ximin_sso'; 
const { KinesisVideo } = require('@aws-sdk/client-kinesis-video');
const express = require('express');
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temporarily store files in 'uploads' folder
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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
        const bucketName = 'cosc499-video-submission'; // Replace with your S3 bucket name
        const key = `videos/${Date.now()}_${file.originalname}`;

        // Read the file from the local file system
        const fileStream = fs.createReadStream(file.path);

        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: fileStream,
            ContentType: file.mimetype,
        };

        const data = await s3Client.send(new PutObjectCommand(uploadParams));

        // Delete the file from local storage after uploading
        fs.unlinkSync(file.path);

        res.status(200).json({ message: 'Video uploaded successfully', data });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'Error uploading video', details: error.toString() });
    }
});


module.exports = router;
