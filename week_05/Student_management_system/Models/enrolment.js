const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "student is required"],
    },
    courseCode: {
      type: String,
      required: [true, "course code is required"],
    },
    enrolmentDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = Enrollment;
