exports.handler = async (event) => {

    const url = `https://sampleserver6.arcgisonline.com/${event['pathParameters']['proxy']}`;

    console.log('url will be ', url);

    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
