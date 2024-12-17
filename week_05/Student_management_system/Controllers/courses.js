const Course = require("../Models/courses");
const Instructor = require("../Models/Instructor");
const AppError = require("../Utils/AppError");
const APIFeatures = require("./../Utils/apiFeatures");

exports.createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      courseCode,
      courseDescription,
      credits,
      courseDuration,
      department,
      semester,
    } = req.body;

    if (
      !courseName ||
      !courseCode ||
      !courseDescription ||
      !credits ||
      !courseDuration ||
      !department ||
      !semester
    ) {
      return next(new AppError("Please provide all required fields", 400));
    }
    const course = await Course.create({
      ...req.body,
      courseCode: courseCode.toUpperCase(),
      instructorId: req.user.id,
    });
    if (!course) {
      return next(new AppError("an error occurred while creating course", 400));
    }
    const currentInstructor = await Instructor.findById(req.user.id);
    currentInstructor.coursesTaught.push(course._id);

    await currentInstructor.save();
    res.status(201).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("Course already exists", 400));
    }
    next(error);
  }
};

exports.getCourses = async (req, res, next) => {
  try {
    const features = new APIFeatures(Course.find(), req.query)
      .filter()
      .paginate();
    const courses = await features.query;
    const documentCount = await Course.countDocuments();
    if (!courses) {
      return next(new AppError("an error occurred while getting courses", 400));
    }
    res.status(200).json({
      status: "success",
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourseDetails = async (req, res, next) => {
  try {
    const { courseCode } = req.params;
    const course = await Course.find({
      courseCode: courseCode.toUpperCase(),
    });
    if (!course) {
      return next(new AppError("an error occurred while getting course", 400));
    }
    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    const { courseCode } = req.params;
    const course = await Course.findOneAndUpdate(
      { courseCode: courseCode.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return next(new AppError("course with this courseCode not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const { courseCode } = req.params;

    //check if course is available
    const courseToDelete = await Course.findOne({
      courseCode: courseCode.toUpperCase(),
    });
    if (!courseToDelete) {
      return next(new AppError("course with this courseCode not found", 404));
    }

    //check if user is authorized to delete this course
    if (courseToDelete.instructorId.toString() !== req.user.id) {
      return next(
        new AppError("You are not authorized to delete this course", 401)
      );
    }

    //delete course if user is authorized
    const course = await Course.deleteOne({
      courseCode: courseCode.toUpperCase(),
    });
    if (!course) {
      return next(new AppError("course with this courseCode not found", 404));
    }

    //delete course from instructor
    const instructor = await Instructor.findById(req.user.id);
    instructor.coursesTaught.pop(courseToDelete._id);
    await instructor.save();

    res.status(200).json({
      status: "success",
      message: "course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.sortCourses = async (req, res, next) => {
  try {
    const queries = req.query.sort;
    const features = new APIFeatures(Course.find(), req.query).sort();
    const courses = await features.query;
    if (!courses) {
      return next(new AppError("an error occurred while getting courses", 400));
    }
    res.status(200).json({
      status: "success",
      fields: queries,
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};
