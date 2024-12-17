const JWT = require("jsonwebtoken");
const AppError = require("../Utils/AppError");

exports.protected = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("you are not logged in", 401));
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

exports.isInstructor = (req, res, next) => {
  try {
    if (req.user.role !== "instructor")
      return next(new AppError("Not authorized as an instructor", 401));
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};
