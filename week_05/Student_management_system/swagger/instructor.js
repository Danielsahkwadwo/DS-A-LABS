const Instructor = require("../Models/Instructor");

const instructorSchema = {
  Instructor: {
    type: "object",
    properties: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      email: {
        type: "string",
        required: true,
      },
      dateOfBirth: {
        type: "string",
        required: true,
      },
      phoneNumber: {
        type: "string",
        required: true,
      },
      department: {
        type: "string",
        required: true,
      },
      coursesTaught: {
        type: "array",
        items: {
          type: "string",
        },
      },
      password: {
        type: "string",
        required: true,
      },
    },
    example: {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      dateOfBirth: "1990-01-01",
      phoneNumber: "1234567890",
      department: "Computer Science",
      coursesTaught: ["Course 1", "Course 2"],
      password: "password123",
    },
  },
  InstructorLogin: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "The email of the instructor",
      },
      password: {
        type: "string",
        description: "The password of the instructor",
      },
    },
    example: {
      email: "johndoe@example.com",
      password: "password123",
    },
  },
};

module.exports = instructorSchema;
