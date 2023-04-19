const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'mysecretsshhhhh';
const expiration = process.env.JWT_EXPIRATION || '2h';

function getTokenFromHeader(authorizationHeader) {
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer') return null;

  return token.trim();
}

async function authMiddleware({ req, connection }, next) {
  const token = req ? getTokenFromHeader(req.headers.authorization) || req.query.token : connection?.context?.Authorization;

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    // connection?.context = { Authorization: token };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid or expired token');
  }

  return next();
}

function signToken({ username, email, _id }) {
  const payload = { username, email, _id };
  const options = { expiresIn: expiration };
  return jwt.sign({ data: payload }, secret, options);
}

module.exports = {
  authMiddleware,
  signToken,
};