const { withCORS } = require('./withCORS');
const withLogs = require('./withLogs');
const withAuth = require('./withAuth');

const applyMiddlewares = (middlewareList = []) => (handler) =>
  middlewareList.reduceRight((request, middleware) => middleware(request), handler);

module.exports = applyMiddlewares([withAuth, withLogs, withCORS]);
