const { withCORS } = require('./withCORS');
const withLogs = require('./withLogs');

const applyMiddlewares = (middlewareList = []) => (handler) =>
  middlewareList.reduceRight((request, middleware) => middleware(request), handler);

module.exports = applyMiddlewares([withLogs, withCORS]);
