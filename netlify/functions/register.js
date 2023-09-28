const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

  try {
    const body = JSON.parse(event.body);
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = new User({
      email: body.email,
      password: hashedPassword,
    });
    await user.save();
    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error registering user' }),
    };
  }
};
