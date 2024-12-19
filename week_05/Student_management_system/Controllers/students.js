const Student = require("../Models/students");
const AppError = require("../Utils/AppError");
const { createJWT } = require("../Utils/createJWT");
const { createToken, hashToken } = require("../Utils/createToken");
const mergeSort = require("../Utils/mergeSort");
const APIFeatures = require("./../Utils/apiFeatures");

exports.addStudent = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      gender,
      studentId,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !phoneNumber ||
      !gender ||
      !studentId
    ) {
      next(new AppError("All fields are required", 400));
    }
    const student = await Student.create({
      ...req.body,
      email: email.toLowerCase(),
      studentId: studentId.toLowerCase(),
    });
    if (!student) {
      return new AppError("an error occurred while creating student", 400);
    }
    res.status(201).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("Email or student ID already exists", 400));
    }
    next(err);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    //creating an instance of the APIFeatures class
    const features = new APIFeatures(
      Student.find().select("-password"),
      req.query
    )
      .filter()
      .paginate();

    const students = await features.query;
    if (!students) {
      return next(new AppError("No students found", 404));
    }
    res.status(200).json({
      status: "success",
      results: students.length,
      data: {
        students,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    let id = req.params.id;
    const student = await Student.findById(id).select("-password");
    if (!student) {
      return next(new AppError("No student found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getSelf = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      studentId: req.user.studentId,
    }).select("-password");
    if (!student) {
      return next(new AppError("No student found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateStudent = async (req, res, next) => {
  try {
    let id = req.params.id;
    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return next(new AppError("No student found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSelf = async (req, res, next) => {
  try {
    //excluding fields for students
    let excludedFields = [
      "password",
      "email",
      "studentId",
      "gpa",
      "department",
      "role",
    ];

    Object.keys(req.body).forEach((val) => {
      if (excludedFields.includes(val)) delete req.body[val];
    });
    const student = await Student.findOneAndUpdate(
      { studentId: req.user.studentId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!student) {
      return next(new AppError("No student found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        student,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return next(new AppError("No student found", 404));
    }
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};

exports.loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return next(new AppError("Invalid email or password", 401));
    }
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    //create JWT if password is correct
    const token = createJWT(student._id, student.role, student.studentId);
    res.status(200).json({
      status: "success",
      data: {
        student,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.sortStudents = async (req, res, next) => {
  try {
    let { sort } = req.query;
    if (!sort) return next(new AppError("Please provide a sort criteria", 400));

    let order = "asc";
    // Check if sort starts with "-" for descending order
    if (sort.startsWith("-")) {
      order = "desc";
      sort = sort.slice(1);
    }
    //get all students from database
    const students = await Student.find().select("-password");

    //apply merge sort
    const sortedStudents = mergeSort(students, sort, order);
    if (!students) {
      return next(new AppError("No students found", 404));
    }
    res.status(200).json({
      status: "success",
      fields: sort,
      order,
      data: [...sortedStudents],
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError("Email is required", 400));
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return next(new AppError("No student found", 404));
    }
    const resetToken = createToken();
    const hashedToken = hashToken(resetToken);

    student.resetToken = hashedToken;
    student.resetTokenExpires = Date.now() + 60 * 60 * 1000; // token expires in 1 hour
    await student.save();

    res.status(200).json({
      status: "success",
      token: resetToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.passwordReset = async (req, res, next) => {
  try {
    const { email, token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
      return next(new AppError("Password is required", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(new AppError("Passwords do not match", 400));
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return next(new AppError("No student found", 404));
    }
    const hashedToken = hashToken(token);
    if (
      student.resetToken !== hashedToken ||
      student.resetTokenExpires < Date.now()
    ) {
      return next(new AppError("Invalid token or token has expired", 400));
    }
    student.password = newPassword;
    student.resetToken = null;
    student.resetTokenExpiration = null;

    await student.save();
    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
};
