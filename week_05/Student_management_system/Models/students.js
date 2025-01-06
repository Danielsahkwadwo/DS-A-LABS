const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true,
      index: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "date of birth is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
    },
    department: {
      type: String,
      required: [true, "department is required"],
      index: true,
    },
    studentId: {
      type: String,
      required: [true, "student id is required"],
      unique: [true, "student id must be unique"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "gender is required"],
    },
    gpa: {
      type: String,
    },
    coursesEnrolled: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "course",
      },
    ],
    role: {
      type: String,
      default: "student",
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

studentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.index({ firstName: 1, lastName: 1, department: 1 });
const Student = mongoose.model("student", studentSchema);

module.exports = Student;
