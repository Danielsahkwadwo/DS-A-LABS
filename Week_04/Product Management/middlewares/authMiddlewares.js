const JWT = require("jsonwebtoken");
const User = require("./../models/users");
exports.protect = async (req, res, next) => {
  try {
    let token = req.session.jwt;
    if (!token) {
      throw new Error("authorization denied");
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      throw new Error("token is invalid or expired");
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};
