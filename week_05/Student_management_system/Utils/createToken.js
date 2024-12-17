const crypto = require("node:crypto");

exports.createToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

exports.hashToken = function (token) {
  const hash = crypto
    .createHash("sha256")
    .update(token.toString())
    .digest("hex");
  return hash;
};
