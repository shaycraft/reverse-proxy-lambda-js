const ResponseStream = require('./response-stream');
const ResponseStreamType = require('./response-stream-type');
const https = require('https');

/***
 *
 * @param url {string}
 * @param headers {unknown}
 * @returns {Promise<{statusCode: number, body: string}>}
 */
async function issueRequest(url, headers) {
  return new Promise((resolve, reject) => {
    /**
     *
     * @type {RequestOptions}
     */
    const options = { headers };

    https.get(url, options, (response) => {
      /***
       * @type {ResponseStream}
       */
      let stream;
      const headers = { 'content-type': response.headers['content-type'] };

      if (
        response.headers['content-type'].indexOf('html') > -1 ||
        response.headers['content-type'].indexOf('json') > -1
      ) {
        stream = new ResponseStream(ResponseStreamType.BINARY);
      } else {
        stream = new ResponseStream(ResponseStreamType.PLAINTEXT);
      }

      response.on('data', (chunk) => {
        stream.push(chunk);
      });

      response.on('end', () => {
        resolve({
          ...stream.dump(),
          headers,
        });
      });

      response.on('error', (err) => {
        reject(err);
      });
    });
  });
}

/***
 *
 * @param event {
 * { rawQueryString: string, httpMethod: string }
 * }
 * @returns {Promise<{body: string, statusCode: number}>}
 */
exports.handler = async (event) => {
  /**
   * @type {ResponseStream}
   */
  let responseStream;

  let url = `https://sampleserver6.arcgisonline.com/${event['pathParameters']['proxy']}`;
  let httpMethod;

  console.log('url will be ', url);

  if (event.rawQueryString) {
    url = `${url}?${event['rawQueryString']}`;
  }

  if (event.httpMethod) {
    httpMethod = event.httpMethod;
  } else {
    httpMethod = event['requestContext']['http']['method'];
  }

  let headers = '';
  if (event['headers']) {
    headers = event['headers'];
  }

  delete headers['Host'];
  delete headers['host'];

  let body = event['body'] || null;

  try {
    return issueRequest(url, headers);
  } catch (err) {
    return {
      statusCode: 500,
      body: `Content error: ${JSON.stringify(err)}`,
    };
  }
};
