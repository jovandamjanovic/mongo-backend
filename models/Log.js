const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    method: String,
    path: String,
    body: String,
    user: String,
  },
  { timestamps: true }
);

const Log = mongoose.model('Log', logSchema);

const logEntry = async ({ method, path, body, user }) => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const log = new Log({
    method,
    path,
    body,
    user,
  });
  await log.save();
};

exports.logSchema = logSchema;
exports.logEntry = logEntry;
exports.Log = Log;
