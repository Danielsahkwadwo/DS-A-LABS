const JWT = require("jsonwebtoken");

exports.createJWT = function (id) {
  const token = JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

