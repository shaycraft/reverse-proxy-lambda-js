const ResponseStream = require('./response-stream');
const ResponseStreamType = require('./response-stream-type');
const https = require('https');

class ReverseProxy {
  /***
   * @type {{
   * get: (url: string, options: unknown, (args:any) => void) => void
   * }}
   */
  https;
  /***
   * @type {ResponseStream}
   */
  stream;

  constructor(https, stream) {
    this.https = https;
    this.stream = stream;
  }

  /***
   *
   * @param url {string}
   * @param headers {unknown}
   * @returns {Promise<{statusCode: number, body: string}>}
   */
  async issueRequest(url, headers) {
    return new Promise((resolve, reject) => {
      const options = { headers };

      this.https.get(url, options, (response) => {
        const headers = { 'content-type': response.headers['content-type'] };
        if (
          response.headers['content-type'].indexOf('html') > -1 ||
          response.headers['content-type'].indexOf('json') > -1
        ) {
          this.stream.streamType = ResponseStreamType.PLAINTEXT;
        } else {
          this.stream.streamType = ResponseStreamType.BINARY;
        }

        response.on('data', (chunk) => {
          console.debug('DEBUG.... pushing data');
          this.stream.push(chunk);
        });

        response.on('end', () => {
          resolve({
            ...this.stream.dump(),
            headers,
          });
        });

        response.on('error', (err) => {
          reject(err);
        });
      });
    });
  }
}

module.exports = ReverseProxy;
