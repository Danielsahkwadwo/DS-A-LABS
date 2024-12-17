const Student = require("../Models/students");
const AppError = require("../Utils/AppError");
const { createJWT } = require("../Utils/createJWT");
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
    let id;
    req.user.role === "student" ? (id = req.user.id) : req.params.id;
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

exports.updateStudent = async (req, res, next) => {
  try {
    let id;
    req.user.role === "student" ? (id = req.user.id) : req.params.id;
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
    const token = createJWT(student._id, student.role);
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
    const queries = req.query.sort;
    const features = new APIFeatures(
      Student.find().select("-password"),
      req.query
    ).sort();
    const students = await features.query;
    if (!students) {
      return next(new AppError("No students found", 404));
    }
    res.status(200).json({
      status: "success",
      fields: queries,
      results: students.length,
      data: {
        students,
      },
    });
  } catch (err) {
    next(err);
  }
};
