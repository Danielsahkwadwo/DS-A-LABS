const JWT = require("jsonwebtoken");
const User = require("./../models/users");
exports.protect = async (req, res, next) => {
  try {
    let token = req.session.jwt;
    if (!token) {
      res.redirect("/login");
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      res.redirect("/login");
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      throw new Error("Not authorized as an admin");
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};
