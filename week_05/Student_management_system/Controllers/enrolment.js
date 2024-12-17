const Course = require("../Models/courses");
const Enrollment = require("../Models/enrolment");
const Student = require("../Models/students");
const AppError = require("../Utils/AppError");

exports.createEnrollment = async (req, res, next) => {
  try {
    const { studentId, courseCode } = req.body;
    if (!studentId || !courseCode) {
      return next(new AppError("Please provide all required fields", 400));
    }

    //check if student exist
    const student = await Student.findOne({
      studentId: studentId.toLowerCase(),
    });
    if (!student) {
      return next(new AppError("No student with this ID found", 404));
    }

    //check if course exist
    const course = await Course.findOne({
      courseCode: courseCode.toLowerCase(),
    });
    if (!course) {
      return next(new AppError("No course with this code found", 404));
    }

    //check if student is already enrolled in this course
    if (student.coursesEnrolled.includes(course._id)) {
      return next(
        new AppError("student is already enrolled in this course", 400)
      );
    }
    const enrollment = await Enrollment.create({ studentId, courseCode });
    if (!enrollment) {
      return next(
        new AppError("an error occurred while creating enrollment", 400)
      );
    }

    student.coursesEnrolled.push(course._id);
    await student.save();

    res.status(201).json({
      status: "success",
      data: {
        enrollment,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentEnrollments = async (req, res, next) => {
  try {
    let studentId;
    req.user.role === "student"
      ? (studentId = req.user.id)
      : req.params.studentId;
    const enrollments = await Enrollment.find({ studentId: studentId });
    if (!enrollments) {
      return next(
        new AppError("an error occurred while getting enrollments", 400)
      );
    }
    res.status(200).json({
      status: "success",
      data: {
        enrollments,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEnrollment = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;

    const enrollmentToDelete = await Enrollment.findById(enrollmentId);

    if (!enrollmentToDelete) {
      return next(new AppError("enrollment not found", 400));
    }
    const student = await Student.find({
      studentId: enrollmentToDelete.studentId,
    });
    if (!student) {
      return next(new AppError("student not found", 400));
    }

    const course = await Course.find({
      courseCode: enrollmentToDelete.courseCode,
    });
    if (!course) {
      return next(new AppError("course not found", 400));
    }

    const enrollment = await Enrollment.deleteOne({
      _id: enrollmentId,
    });
    if (!enrollment) {
      return next(new AppError("enrollment not found", 400));
    }

    console.log(course);
    student.coursesEnrolled.pop(course._id);
    await student.save();

    res.status(200).json({
      status: "success",
      message: "enrolment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
