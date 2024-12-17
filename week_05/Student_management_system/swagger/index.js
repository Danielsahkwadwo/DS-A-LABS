const swaggerJsdoc = require("swagger-jsdoc");
const studentSchema = require("./students");
const courseSchema = require("./courses");
const enrollmentSchema = require("./enrollments");
const instructorSchema = require("./instructor");

//schemas configuration
const schemas = {
  ...studentSchema,
  ...courseSchema,
  ...enrollmentSchema,
  ...instructorSchema,
};
//swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management System API",
      version: "1.0.0",
      description:
        "A robust API documentation for Student Management System designed to digitize and streamline school administrative processes, focusing on comprehensive data management, complex sorting mechanisms, and efficient API design",
    },
    servers: [{ url: "http://localhost:8000" }],
    components: {
      schemas,
    },
  },
  apis: ["./Routes/*.js"],
};

const Specs = swaggerJsdoc(swaggerOptions);
module.exports = Specs;
