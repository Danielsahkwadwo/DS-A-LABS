const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const instructorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "date of birth is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
    },
    department: {
      type: String,
      required: [true, "department is required"],
    },
    coursesTaught: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    role: {
      type: String,
      default: "instructor",
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    resetToken: {
      type: String,
    },
  },
  { timestamps: true }
);
instructorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

instructorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
