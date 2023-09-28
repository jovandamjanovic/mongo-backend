const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
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
  const authHeader = event.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return { statusCode: 403, body: 'Forbidden' };
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Protected data',
          userId: user.userId,
        }),
      };
    });
  } else {
    return { statusCode: 401, body: 'Unauthorized' };
  }
};
