const JWT = require("jsonwebtoken");

exports.createJWT = function (id, role) {
  const token = JWT.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};
