const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is not set. Add it to your .env file before starting the server.'
  );
}

const JWT_EXPIRY = '24h';

const signToken = (user) =>
  jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { signToken, verifyToken };
