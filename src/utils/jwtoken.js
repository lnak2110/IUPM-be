const jwt = require('jsonwebtoken');
const config = require('./config');
const { unauthCode } = require('./response');
const { validateIdFromToken } = require('./validation');

const secretKey = config.SECRET_KEY;
const tokenLife = config.TOKEN_LIFE;

const createToken = (data) => {
  const token = jwt.sign({ content: data }, secretKey, {
    expiresIn: tokenLife,
  });
  return token;
};

const verifyToken = (token) => {
  const verifyResult = jwt.verify(token, secretKey, { ignoreExpiration: true });
  console.log('Verify result', verifyResult);
  return verifyResult;
};

const checkToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];

    const isTokenValid = verifyToken(accessToken);

    // Check id is a UUID
    validateIdFromToken(isTokenValid.content);

    if (isTokenValid) {
      next();
    }
  } catch (error) {
    console.log(error);
    return unauthCode(res);
  }
};

module.exports = {
  createToken,
  verifyToken,
  checkToken,
};
