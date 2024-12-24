const AppError = require("../Utils/AppError");
const { createJWT } = require("../Utils/createJWT");
const Instructor = require("./../Models/Instructor");

exports.addInstructor = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      phoneNumber,
      department,
      password,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !dateOfBirth ||
      !phoneNumber ||
      !department ||
      !password
    ) {
      return next(new AppError("please fill all required fields", 400));
    }
    const newInstructor = await Instructor.create(req.body);
    if (!newInstructor) {
      return next(
        new AppError("an error occurred while creating instructor", 400)
      );
    }
    res.status(201).json({
      status: "success",
      data: {
        instructor: newInstructor,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find();
    if (!instructors) {
      return next(
        new AppError("an error occurred while getting instructors", 400)
      );
    }
    res.status(200).json({
      status: "success",
      results: instructors.length,
      data: {
        instructors,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.findById(req.user.id);
    if (!instructor) {
      return next(
        new AppError("an error occurred while getting instructor", 400)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        instructor,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!instructor) {
      return next(
        new AppError("an error occurred while updating instructor", 400)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        instructor,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteInstructor = async (req, res, next) => {
  try {
    await Instructor.findByIdAndDelete(req.user.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.loginInstructor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const instructor = await Instructor.findOne({ email: email });
    if (!instructor) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const isMatch = await instructor.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = createJWT(instructor._id, instructor.role, null);
    res.status(200).json({
      status: "success",
      data: {
        instructor,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
