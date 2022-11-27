const https = require('https');
const ResponseStream = require('./response-stream');
const ReverseProxy = require('./reverse-proxy');

/***
 *
 * @param event {
 * { rawQueryString: string, httpMethod: string }
 * }
 * @returns {Promise<{body: string, statusCode: number}>}
 */
exports.handler = async (event) => {
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
    const proxy = new ReverseProxy(https, new ResponseStream());
    return proxy.issueRequest(url, headers);
  } catch (err) {
    return {
      statusCode: 500,
      body: `Content error: ${JSON.stringify(err)}`,
    };
  }
};
