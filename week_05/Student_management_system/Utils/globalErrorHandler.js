const { default: mongoose } = require("mongoose");
const AppError = require("./appError");

const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      stack: err.stack,
      message: err.message,
    });
  }

  if (err.code === "E11000") {
    return res.status(500).json({
      status: "error",
      stack: err.stack,
      message: "Email already exists",
    });
  }

  if (err.code === "ECONNREFUSED") {
    console.log(err.stack);
    return res.status(500).json({
      status: "error",
      message: "Database connection error",
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((el) => el.message);
    return res.status(400).json({
      status: "fail",
      stack: err.stack,
      errors,
    });
  } else {
    return res.status(500).json({
      status: "error",
      stack: err.stack,
      message: "Something went wrong",
    });
  }
};

module.exports = globalErrorHandler;
