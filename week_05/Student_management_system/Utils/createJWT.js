const JWT = require("jsonwebtoken");

exports.createJWT = function (id, role, studentId) {
  const token = JWT.sign({ id, role, studentId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};
