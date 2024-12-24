const Course = require("../Models/courses");

const courseSchema = {
  Course: {
    type: "object",

    required: [
      "courseName",
      "courseCode",
      "courseDescription",
      "credits",
      "InstructorId",
      "courseDuration",
      "department",
    ],
    properties: {
      courseName: {
        type: "string",
        description: "The name of the course",
      },
      courseCode: {
        type: "string",
        description: "The code of the course",
      },
      courseDescription: {
        type: "string",
        description: "The description of the course",
      },
      credits: {
        type: "number",
        description: "The number of credits for the course",
      },
      InstructorId: {
        type: "string",
        description: "The ID of the instructor",
      },
      courseDuration: {
        type: "string",
        description: "The duration of the course",
      },
      department: {
        type: "string",
        description: "The department of the course",
      },
    },
    example: {
      courseName: "Web Development",
      courseCode: "WEBD",
      courseDescription: "This course is about web development",
      credits: 3,
      InstructorId: "123456789",
      courseDuration: "6 months",
      department: "Computer Science",
    },
  },
};
module.exports = courseSchema;
