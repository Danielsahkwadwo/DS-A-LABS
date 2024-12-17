const Student = require("../Models/students");

const studentSchema = {
  Student: {
    type: "object",
    required: [
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
      "phoneNumber",
      "password",
      "department",
      "gender",
      "studentId",
    ],
    properties: {
      firstName: {
        type: "string",
        description: "The first name of the student",
      },
      lastName: {
        type: "string",
        description: "The last name of the student",
      },
      email: {
        type: "string",
        format: "email",
        description: "The email of the student",
        uniqueItems: true,
      },
      dateOfBirth: {
        type: "date",
        description: "The date of birth of the student",
      },
      phoneNumber: {
        type: "string",
        description: "The phone number of the student",
      },
      password: {
        type: "string",
        description: "The password of the student",
      },
      department: {
        type: "string",
        description: "The department of the student",
      },
      gender: {
        type: "string",
        description: "The gender of the student",
      },
      studentId: {
        type: "string",
        description: "The student ID of the student",
        uniqueItems: true,
      },
    },
    example: {
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      dateOfBirth: "1990-01-01",
      phoneNumber: "1234567890",
      password: "password123",
      department: "Computer Science",
      gender: "male",
      studentId: "UEB3512920",
    },
  },
  StudentLogin: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "The email of the student",
      },
      password: {
        type: "string",
        description: "The password of the student",
      },
    },
    example: {
      email: "johndoe@example.com",
      password: "password123",
    },
  },
};

module.exports = studentSchema;