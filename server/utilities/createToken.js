const jwt = require("jsonwebtoken");

const createToken = (payload, secret, expiration) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiration
  });
  return token;
};

module.exports = createToken;
