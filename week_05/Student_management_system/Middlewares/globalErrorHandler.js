const { default: mongoose } = require("mongoose");
const AppError = require("../Utils/AppError");

const globalErrorHandler = (err, req, res, next) => {
  // console.log(err.stack);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  if (err.code === "ECONNREFUSED") {
    console.log(err.stack);
    return res.status(500).json({
      message: "Database connection error",
      status: "error",
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      status: "fail",
      errors,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }
};

module.exports = globalErrorHandler;
