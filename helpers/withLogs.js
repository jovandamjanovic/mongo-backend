const mongoose = require('mongoose');
const { logEntry } = require('../models/Log');
const jwt = require('jsonwebtoken');

const withLogs = (handler) => {
  var original = handler;
  handler = async function () {
    let event = arguments[0];
    let authHeader = event.headers.authorization;
    let userId;
    if (authHeader) {
      userId = jwt.verify(
        authHeader.split(' ')[1],
        process.env.JWT_SECRET,
        (err, payload) => {
          if (err) return 'Invalid User';
          return payload.userId;
        }
      );
    }
    await logEntry({
      method: event.httpMethod,
      path: event.path,
      body: event.body,
      user: userId,
    });
    return await original.apply(this, arguments);
  };
  return handler;
};

module.exports = withLogs;
