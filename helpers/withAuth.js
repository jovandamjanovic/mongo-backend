const mongoose = require('mongoose');
const { logEntry } = require('../models/Log');
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');

const withAuth = (handler) => {
  var original = handler;
  handler = async function () {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let [event, context, ...rest] = arguments;
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
    if (userId) {
      const reqUser = await User.findOne({ _id: userId });
      if (reqUser) {
        context = { ...context, reqUser };
      }
    }
    return await original.apply(this, [event, context, ...rest]);
  };
  return handler;
};

module.exports = withAuth;
