// router/awsRouter.js

const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
require('dotenv').config({ path: "./process.env" });
AWS.config.update({region: 'us-east-1'});

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
    region: 'us-east-1' // Change to your AWS region
});
console.log("Updated AWS Config:", AWS.config.credentials.accessKeyId, AWS.config.region);
const sts = new AWS.STS();

async function getTemporaryCredentials() {
    return sts.assumeRole({
        RoleArn: 'arn:aws:iam::466618866658:role/web-rtc-499', // replace with your role's ARN
        RoleSessionName: 'WebClientSession' // This is an identifier for the session
    }).promise();
};

// Express.js route handler to provide temporary credentials to the client
router.get('/get-temp-credentials', async (req, res) => {
    try {
        const data = await getTemporaryCredentials();
        res.json({
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken,
            expiration: data.Credentials.Expiration // send expiration time as well
        });
    } catch (error) {
        console.error('Error assuming role:', error);
        res.status(500).json({ error: 'Error obtaining temporary credentials', details: error.toString() });
        
    }
});

router.get('/getSignalingChannelConfig', async (req, res) => {
    const channelARN = req.query.channelARN;
    const kinesisVideoClient = new AWS.KinesisVideo();
    try {
        // Get signaling channel endpoint
        const endpointResponse = await kinesisVideoClient.getSignalingChannelEndpoint({
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: ['WSS', 'HTTPS'],
                Role: 'VIEWER',
            },
        }).promise();

        // Extract the endpoints
        const endpointsByProtocol = endpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
        }, {});

        // Send the response back to the client
        res.json({ endpointsByProtocol });
    } catch (error) {
        console.error('Error fetching signaling channel config:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
