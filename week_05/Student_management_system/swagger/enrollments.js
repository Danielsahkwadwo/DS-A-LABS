const enrolmentSchema = {
  Enrolment: {
    type: "object",
    properties: {
      studentId: {
        type: "string",
      },
      courseId: {
        type: "string",
        format: "ObjectId",
      },
      courseCode: {
        type: "string",
      },
      enrolmentDate: {
        type: "string",
        format: "date",
      },
    },
    example: {
      studentId: "UEB3512022",
      courseId: "64d8f8a9f8f8f8f8f8f8f8f",
      courseCode: "courseCode",
      enrolmentDate: "2022-01-01",
    },
  },
};

module.exports = enrolmentSchema