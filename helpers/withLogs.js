const { logEntry } = require('../models/Log');

const withLogs = (handler) => {
  var original = handler;
  handler = async function () {
    let [event, context, ...rest] = arguments;
    await logEntry({
      method: event.httpMethod,
      path: event.path,
      body: event.body,
      user: context.reqUser._id,
    });
    return await original.apply(this, [event, context, ...rest]);
  };
  return handler;
};

module.exports = withLogs;
