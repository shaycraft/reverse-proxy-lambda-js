const rs = require('../src/response-stream');
const fs = require('fs');

describe('Response stream tester', () => {
  test('Instantiates constructor without error', () => {
    const derPath = './assets/der.jpg'; // relative to test run, not this file
    const obj = new rs.ResponseStream(rs.ResponseStreamType.BINARY);
    const data = fs.readFileSync(derPath);
    const expectedBase64 = data.toString('base64');

    const buff1 = data.slice(0, Math.floor(data.length / 2));
    const buff2 = data.slice(buff1.length);

    obj.push(buff1);
    obj.push(buff2);

    const result = obj.dump();

    expect(result.body).toEqual(expectedBase64);
    expect(result.isBase64Encoded).toBe(true);
    expect(result.responseCode).toBe(200);
  });
});
