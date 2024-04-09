"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Provides dates with an offset to account for local clock skew.
 *
 * Unfortunately, WebSockets in the web do not provide any of the connection information needed to determine the clock skew from a failed connection request.
 * Therefore, a hard coded offset is used that is provided from the AWS SDK.
 *
 * See {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#correctClockSkew-property}
 */
var DateProvider = /** @class */ (function () {
    function DateProvider(clockOffsetMs) {
        this.clockOffsetMs = clockOffsetMs;
    }
    /**
     * Gets the current date with any configured clock offset applied.
     */
    DateProvider.prototype.getDate = function () {
        return new Date(Date.now() + this.clockOffsetMs);
    };
    return DateProvider;
}());
exports.default = DateProvider;
//# sourceMappingURL=DateProvider.js.map