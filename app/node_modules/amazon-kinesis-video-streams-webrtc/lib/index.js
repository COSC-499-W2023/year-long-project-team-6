"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.SigV4RequestSigner = exports.SignalingClient = exports.Role = void 0;
/*!
Amazon Kinesis Video Streams WebRTC SDK for JavaScript
Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.

This product includes software developed at
Amazon Web Services, Inc. (http://aws.amazon.com/).
*/
var Role_1 = require("./Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return Role_1.Role; } });
var SignalingClient_1 = require("./SignalingClient");
Object.defineProperty(exports, "SignalingClient", { enumerable: true, get: function () { return SignalingClient_1.SignalingClient; } });
var SigV4RequestSigner_1 = require("./SigV4RequestSigner");
Object.defineProperty(exports, "SigV4RequestSigner", { enumerable: true, get: function () { return SigV4RequestSigner_1.SigV4RequestSigner; } });
exports.VERSION = process.env.PACKAGE_VERSION;
//# sourceMappingURL=index.js.map