const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
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
