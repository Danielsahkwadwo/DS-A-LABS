const Course = require("../Models/courses");
const Enrollment = require("../Models/enrolment");
const Student = require("../Models/students");
const AppError = require("../Utils/AppError");

exports.getEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find();
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
exports.createEnrollment = async (req, res, next) => {
  try {
    const { studentId, courseCode } = req.body;
    if (!studentId || !courseCode) {
      return next(new AppError("Please provide all required fields", 400));
    }

    //check if student exist
    const student = await Student.findOne({
      studentId: studentId.toUpperCase(),
    });
    if (!student) {
      return next(new AppError("No student with this ID found", 404));
    }

    //check if course exist
    const course = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
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
    //update student
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

exports.selfEnrollment = async (req, res, next) => {
  try {
    const { courseCode } = req.body;
    if (!courseCode) {
      return next(new AppError("course code not provided", 400));
    }
    //check if course exist
    const course = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
    });
    if (!course) {
      return next(new AppError("No course with this code found", 404));
    }
    //check if user is already enrolled
    const student = await Student.findById(req.user.id);
    if (!student) {
      return next(new AppError("student not found", 404));
    }
    if (student.coursesEnrolled.includes(course._id)) {
      return next(new AppError("you are already enrolled in this course", 400));
    }
    //enrol student if not already enrolled
    const enrollment = await Enrollment.create({
      studentId: student.studentId,
      courseCode,
    });
    if (!enrollment) {
      return next(
        new AppError("an error occurred while creating enrollment", 400)
      );
    }
    //update student
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

exports.deleteEnrollmentByStudent = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    //check if enrollment exist
    const enrollmentToDelete = await Enrollment.findById(enrollmentId);
    if (!enrollmentToDelete) {
      return next(new AppError("enrollment not found", 404));
    }
    //find course within enrollment
    const courseId = await Course.findOne({
      courseCode: enrollmentToDelete.courseCode,
    });
    //update student
    const student = await Student.findById(req.user.id);
    student.coursesEnrolled.pop(courseId._id);
    await student.save();

    //delete enrollment
    await Enrollment.findByIdAndDelete(enrollmentId);
    res.status(200).json({
      status: "success",
      message: "enrolment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteEnrollmentByInstructor = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const result = await Enrollment.findByIdAndDelete(enrollmentId);
    if (!result) {
      return next(new AppError("enrollment not found", 404));
    }
    //get related course
    const course = await Course.findOne({
      courseCode: result.courseCode,
    });
    //update student
    const student = await Student.findOne({ studentId: result.studentId });
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
