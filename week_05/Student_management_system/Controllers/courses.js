const mergeSort = require("../helpers/mergeSort");
const Course = require("../Models/courses");
const AppError = require("../Utils/AppError");
const APIFeatures = require("./../Utils/apiFeatures");

exports.createCourse = async (req, res, next) => {
  try {
    const { courseName, courseCode, courseDescription, credits, courseDuration, department, semester } = req.body;

    if (!courseName || !courseCode || !courseDescription || !credits || !courseDuration || !department || !semester) {
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
    const instructorCourses = await course.populate({
      path: "instructorId",
      select: "coursesTaught",
    });
    instructorCourses.instructorId.coursesTaught.push(course._id);

    await instructorCourses.instructorId.save();
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
    const features = new APIFeatures(Course.find(), req.query).filter().paginate();
    const courses = await features.query;
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
    const course = await Course.findOneAndUpdate({ courseCode: courseCode.toUpperCase() }, req.body, {
      new: true,
      runValidators: true,
    });
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
      return next(new AppError("You are not authorized to delete this course", 401));
    }
    //delete course from instructor
    const instructor = await courseToDelete.populate({
      path: "instructorId",
      select: "coursesTaught",
    });
    instructor.instructorId.coursesTaught.pop(courseToDelete._id);
    await instructor.instructorId.save();

    //delete course if user is authorized
    const course = await Course.deleteOne({
      courseCode: courseCode.toUpperCase(),
    });
    if (!course) {
      return next(new AppError("course with this courseCode not found", 404));
    }

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
    let { sortBy } = req.query;
    let { order } = req.query;
    if (!sortBy) return next(new AppError("Please provide a sort criteria", 400));
    if (order && order !== "asc" && order !== "desc")
      return next(new AppError("Please provide a valid order. either asc or desc", 400));

    // Check if sort starts with "-" for descending order
    if (sortBy.startsWith("-")) {
      order = "desc";
      sortBy = sortBy.slice(1);
    }
    // Get all courses from database
    const courses = await Course.find();
    if (!courses) {
      return next(new AppError("an error occurred while getting courses", 400));
    }
    //apply merge sort
    const sortedCourses = mergeSort(courses, sortBy, order);

    res.status(200).json({
      status: "success",
      fields: sortBy,
      order: order ?? "asc",
      data: [...sortedCourses],
    });
  } catch (error) {
    next(error);
  }
};
