/// <reference types="node" />
import { EventEmitter } from 'events';
import { RequestSigner } from './RequestSigner';
import { Role } from './Role';
/**
 * A partial copy of the credentials from the AWS SDK for JS: https://github.com/aws/aws-sdk-js/blob/master/lib/credentials.d.ts
 * The interface is copied here so that a dependency on the AWS SDK for JS is not needed.
 */
export interface Credentials {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
    getPromise?(): Promise<void>;
}
export interface SignalingClientConfig {
    channelARN: string;
    channelEndpoint: string;
    credentials?: Credentials;
    region: string;
    requestSigner?: RequestSigner;
    role: Role;
    clientId?: string;
    systemClockOffset?: number;
}
export interface StatusResponse {
    correlationId: 'string';
    success: 'boolean';
    errorType?: 'string';
    statusCode?: 'string';
    description?: 'string';
}
/**
 * Client for sending and receiving messages from a KVS Signaling Channel. The client can operate as either the 'MASTER' or a 'VIEWER'.
 *
 * Typically, the 'MASTER' listens for ICE candidates and SDP offers and responds with and SDP answer and its own ICE candidates.
 *
 * Typically, the 'VIEWER' sends an SDP offer and its ICE candidates and then listens for ICE candidates and SDP answers from the 'MASTER'.
 */
export declare class SignalingClient extends EventEmitter {
    private static DEFAULT_CLIENT_ID;
    private websocket;
    private readyState;
    private readonly requestSigner;
    private readonly config;
    private readonly pendingIceCandidatesByClientId;
    private readonly hasReceivedRemoteSDPByClientId;
    private readonly dateProvider;
    /**
     * Creates a new SignalingClient. The connection with the signaling service must be opened with the 'open' method.
     * @param {SignalingClientConfig} config - Configuration options and parameters.
     * is not provided, it will be loaded from the global scope.
     */
    constructor(config: SignalingClientConfig);
    /**
     * Opens the connection with the signaling service. Listen to the 'open' event to be notified when the connection has been opened.
     */
    open(): void;
    /**
     * Asynchronous implementation of `open`.
     */
    private asyncOpen;
    /**
     * Closes the connection to the KVS Signaling Service. If already closed or closing, no action is taken. Listen to the 'close' event to be notified when the
     * connection has been closed.
     */
    close(): void;
    /**
     * Sends the given SDP offer to the signaling service.
     *
     * Typically, only the 'VIEWER' role should send an SDP offer.
     * @param {RTCSessionDescription} sdpOffer - SDP offer to send.
     * @param {string} [recipientClientId] - ID of the client to send the message to. Required for 'MASTER' role. Should not be present for 'VIEWER' role.
     * @param {string} [correlationId] - Unique ID for this message. If this is present and there is an error,
     * Signaling will send a StatusResponse message describing the error. If this is not present, no error will be returned.
     */
    sendSdpOffer(sdpOffer: RTCSessionDescription, recipientClientId?: string, correlationId?: string): void;
    /**
     * Sends the given SDP answer to the signaling service.
     *
     * Typically, only the 'MASTER' role should send an SDP answer.
     * @param {RTCSessionDescription} sdpAnswer - SDP answer to send.
     * @param {string} [recipientClientId] - ID of the client to send the message to. Required for 'MASTER' role. Should not be present for 'VIEWER' role.
     * @param {string} [correlationId] - Unique ID for this message. If this is present and there is an error,
     * Signaling will send a StatusResponse message describing the error. If this is not present, no error will be returned.
     */
    sendSdpAnswer(sdpAnswer: RTCSessionDescription, recipientClientId?: string, correlationId?: string): void;
    /**
     * Sends the given ICE candidate to the signaling service.
     *
     * Typically, both the 'VIEWER' role and 'MASTER' role should send ICE candidates.
     * @param {RTCIceCandidate} iceCandidate - ICE candidate to send.
     * @param {string} [recipientClientId] - ID of the client to send the message to. Required for 'MASTER' role. Should not be present for 'VIEWER' role.
     * @param {string} [correlationId] - Unique ID for this message. If this is present and there is an error,
     * Signaling will send a StatusResponse message describing the error. If this is not present, no error will be returned.
     */
    sendIceCandidate(iceCandidate: RTCIceCandidate, recipientClientId?: string, correlationId?: string): void;
    /**
     * Validates the WebSocket connection is open and that the recipient client id is present if sending as the 'MASTER'. Encodes the given message payload
     * and sends the message to the signaling service.
     */
    private sendMessage;
    /**
     * Removes all event listeners from the WebSocket and removes the reference to the WebSocket object.
     */
    private cleanupWebSocket;
    /**
     * WebSocket 'open' event handler. Forwards the event on to listeners.
     */
    private onOpen;
    /**
     * WebSocket 'message' event handler. Attempts to parse the message and handle it according to the message type.
     */
    private onMessage;
    /**
     * Takes the given base64 encoded string and decodes it into a JSON object.
     */
    private static parseJSONObjectFromBase64String;
    /**
     * Takes the given JSON object and encodes it into a base64 string.
     */
    private static serializeJSONObjectAsBase64String;
    /**
     * If an SDP offer or answer has already been received from the given client, then the given ICE candidate is emitted. Otherwise, it is queued up for when
     * an SDP offer or answer is received.
     */
    private emitOrQueueIceCandidate;
    /**
     * Emits any pending ICE candidates for the given client and records that an SDP offer or answer has been received from the client.
     */
    private emitPendingIceCandidates;
    /**
     * Throws an error if the recipient client id is null and the current role is 'MASTER' as all messages sent as 'MASTER' should have a recipient client id.
     */
    private validateRecipientClientId;
    /**
     * Throws an error if the correlationId does not fit the constraints mentioned in {@link https://docs.aws.amazon.com/kinesisvideostreams-webrtc-dg/latest/devguide/kvswebrtc-websocket-apis4.html the documentation}.
     */
    private validateCorrelationId;
    /**
     * 'error' event handler. Forwards the error onto listeners.
     */
    private onError;
    /**
     * 'close' event handler. Forwards the error onto listeners and cleans up the connection.
     */
    private onClose;
}
