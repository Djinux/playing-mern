const jwt = require('jsonwebtoken');

const generateTokens = function (userId) {
  // access token lasts only for 15 mins and needs to be reasigned using refresh token
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });

  // when the refresh token expires, user gets signed out and needs to sign in/login again
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
