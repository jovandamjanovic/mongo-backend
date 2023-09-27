const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

exports.handler = async (event, context) => {
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
