/**
 * Provides dates with an offset to account for local clock skew.
 *
 * Unfortunately, WebSockets in the web do not provide any of the connection information needed to determine the clock skew from a failed connection request.
 * Therefore, a hard coded offset is used that is provided from the AWS SDK.
 *
 * See {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#correctClockSkew-property}
 */
export default class DateProvider {
    private readonly clockOffsetMs;
    constructor(clockOffsetMs: number);
    /**
     * Gets the current date with any configured clock offset applied.
     */
    getDate(): Date;
}
