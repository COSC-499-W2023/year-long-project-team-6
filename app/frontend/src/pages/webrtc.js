const SignalingClient = require('amazon-kinesis-video-streams-webrtc').SignalingClient;
const KVSWebRTC = require('amazon-kinesis-video-streams-webrtc');
export { uploadVideo };

async function getSignalingChannelConfig(channelARN) {
    const response = await fetch(`http://localhost:5001/getSignalingChannelConfig?channelARN=${encodeURIComponent(channelARN)}`);
    if (!response.ok) {
        throw new Error(`Failed to get signaling channel config: ${response.statusText}`);
    }
    const config = await response.json();
    console.log("Received config from server:", config);
    return config;
}

// Function to fetch temporary AWS credentials
async function fetchCredentials() {
    try {
        const response = await fetch('http://localhost:5001/get-temp-credentials');
        if (!response.ok) {
            throw new Error('Failed to fetch credentials: ' + response.statusText);
        }
        const data = await response.json();
        return {
            accessKeyId: data.accessKeyId,
            secretAccessKey: data.secretAccessKey,
            sessionToken: data.sessionToken
        };
    } catch (error) {
        console.error('Error fetching credentials from server:', error);
        throw error;
    }
}

// Function to create and configure the peer connection
function createPeerConnection(iceServers) {
    const peerConnectionConfig = { iceServers };
    const peerConnection = new RTCPeerConnection(peerConnectionConfig);
    return peerConnection;
}

// Main function to initialize WebRTC connection
export async function initializeWebRTC(channelARN, localView) {
    try {
        const config = await getSignalingChannelConfig(channelARN);
        const { endpointsByProtocol, iceServers } = config;
        const credentials = await fetchCredentials();

        const peerConnection = createPeerConnection(iceServers);
        let localStream = null;

        try {
            localStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: true,
            });
            localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
            localView.srcObject = localStream;
        } catch (e) {
            console.error("Error getting local stream:", e);
            return;
        }

        const signalingClient = new SignalingClient({
            channelARN,
            channelEndpoint: endpointsByProtocol.WSS,
            clientId: '23', // Customize clientId as needed
            role: KVSWebRTC.Role.VIEWER,
            region: 'us-east-1',
            credentials: credentials
        });

        signalingClient.open();

        signalingClient.on('open', async () => {
            const offer = await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            });
            await peerConnection.setLocalDescription(offer);
            signalingClient.sendSdpOffer(peerConnection.localDescription);
        });

        signalingClient.on('sdpAnswer', async answer => {
            await peerConnection.setRemoteDescription(answer);
        });

        signalingClient.on('iceCandidate', candidate => {
            peerConnection.addIceCandidate(candidate);
        });

        return { signalingClient, peerConnection, localStream };
    } catch (error) {
        console.error('Error initializing WebRTC: ', error);
    }
}

export function cleanupWebRTC(signalingClient, peerConnection) {
    console.log("WebRTC is cleaned up");
    if (signalingClient) {
        signalingClient.close();
    }

    if (peerConnection) {
        peerConnection.getSenders().forEach(sender => {
            if (sender.track) {
                sender.track.stop();
            }
        });
        peerConnection.close();
    }
}
