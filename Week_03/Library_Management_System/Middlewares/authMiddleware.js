const jsonwebtoken = require("jsonwebtoken");
const userModel = require("./../Models/userModel");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.userInfo) {
      token = req.cookies.userInfo;
    }
    if (!token) {
      res.redirect("/login");
      throw new Error("you are not logged in");
    }
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const currentUser = await userModel.getUserById(decoded.id);
    if (currentUser.length === 0) {
      res.redirect("/login");
      throw new Error("you are not logged in");
    }
    req.user = currentUser[0];
    res.locals.user = currentUser[0];
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

exports.adminRoleAuth = (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      throw new Error("Not authorized as an admin");
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};
