class ResponseStreamType {
  static PLAINTEXT = 'PLAINTEXT';
  static BINARY = 'BINARY';
}

class ResponseStream {
  /***
   * @type { string | Buffer[] }
   */
  buffer;

  /**
   * @type {string}
   */
  streamType;

  /***
   *
   * @param streamType {string}
   * @constructor
   */
  constructor(streamType) {
    this.streamType = streamType;
    this.buffer = [];
  }

  /***
   *
   * @param val {string | Buffer}
   */
  push(val) {
    if (this.streamType === ResponseStreamType.PLAINTEXT) {
      this.buffer.push(Buffer.from(val).toString('utf-8'));
    } else {
      this.buffer.push(val);
    }
  }

  /***
   *
   * @returns {{responseCode: number, isBase64Encoded: boolean, body: string}}
   */
  dump() {
    if (this.streamType === ResponseStreamType.BINARY) {
      const body = Buffer.concat(
        this.buffer.map((item) => Buffer.from(item))
      ).toString('base64');
      return {
        responseCode: 200,
        isBase64Encoded: true,
        body,
      };
    } else {
      const body = this.buffer.join('');
      return {
        responseCode: 200,
        isBase64Encoded: false,
        body,
      };
    }
  }
}

module.exports = {
  ResponseStream: ResponseStream,
  ResponseStreamType: ResponseStreamType
}