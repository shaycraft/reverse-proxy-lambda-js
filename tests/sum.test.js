const rs = require('../response-stream');

describe('Response stream tester', () => {
  test('Instantiates constructor without error', () => {
    const responseStream = new rs.ResponseStream(rs.ResponseStreamType.BINARY);

    expect(responseStream).toBeTruthy();
  });
});
