const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

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
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const body = JSON.parse(event.body);
  const user = await User.findOne({ email: body.email });

  if (!user) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User not found' }),
    };
  }

  const isValidPassword = await bcrypt.compare(body.password, user.password);

  if (!isValidPassword) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid password' }),
    };
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  return { statusCode: 200, body: JSON.stringify({ token }) };
};
