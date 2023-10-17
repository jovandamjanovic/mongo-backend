const withCORS = (handler) => {
  var original = handler;
  handler = async function () {
    let event = arguments[0];
    if (event.httpMethod === 'OPTIONS') {
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      };
      return {
        statusCode: 200,
        headers,
        body: 'This was a preflight call',
      };
    }
    return await original.apply(this, arguments);
  };
  return handler;
};

exports.withCORS = withCORS;