const JWT = require("jsonwebtoken");

exports.createJWT = function (id) {
  const token = JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

exports.createCookie = function (res, token) {
  const cookies = res.cookie("userInfo", token, {
    path: "/",
    sameSite: true,
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 86400 * 1 * 1000),
  });
  return cookies;
};
