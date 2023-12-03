const SignalingClient = require('amazon-kinesis-video-streams-webrtc').SignalingClient;
const KVSWebRTC = require('amazon-kinesis-video-streams-webrtc');

// Function to request signaling channel endpoint and ICE server configuration from the server
async function getSignalingChannelConfig(channelARN) {
    const response = await fetch(`http://localhost:5001/getSignalingChannelConfig?channelARN=${encodeURIComponent(channelARN)}`);
    if (!response.ok) {
        throw new Error(`Failed to get signaling channel config: ${response.statusText}`);
    }
    const config = await response.json();
console.log("Received config from server:", config);
return config;

}
async function fetchCredentials() {
    try {
        const response = await fetch('http://localhost:5001/get-temp-credentials');  // The endpoint on your server
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
        throw error;  // Rethrow the error to handle it in the calling function
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

        // Get a stream from the webcam and add it to the peer connection
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
            clientId: '23', 
            role: KVSWebRTC.Role.VIEWER,
            region: 'us-east-1',
            credentials: credentials
        });

        signalingClient.open();

        // Set up signaling client event listeners and peer connection logic
        signalingClient.on('open', async () => {
            // Create an SDP offer and send it to the master
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

        return { signalingClient, peerConnection };
    } catch (error) {
        console.error('Error initializing WebRTC: ', error);
    }
}

export function cleanupWebRTC(signalingClient, peerConnection) {
    console.log("webRtc is cleaned");
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