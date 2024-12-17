const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "course name is required"],
    },
    courseCode: {
      type: String,
      required: [true, "course code is required"],
      unique: [true, "course with this code already exists"],
    },
    courseDescription: {
      type: String,
      required: [true, "course description is required"],
    },
    credits: {
      type: Number,
      required: [true, "credit hours is required"],
    },
    instructorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Instructor",
      required: [true, "course instructor is required"],
    },
    courseDuration: {
      type: String,
      required: [true, "course duration is required"],
    },
    department: {
      type: String,
      required: [true, "department is required"],
    },
    semester: {
      type: String,
      required: [true, "semester is required"],
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", coursesSchema);
module.exports = Course;
