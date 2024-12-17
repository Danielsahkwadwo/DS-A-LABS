const enrolmentSchema = {
  Enrolment: {
    type: "object",
    properties: {
      studentId: {
        type: "string",
        format: "ObjectId",
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
      grade: {
        type: "string",
      },
      status: {
        type: "string",
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
    example: {
      studentId: "64d8f8a9f8f8f8f8f8f8f8f",
      courseId: "64d8f8a9f8f8f8f8f8f8f8f",
      courseCode: "courseCode",
      enrolmentDate: "2022-01-01",
      grade: "A",
      status: "pending",
    },
  },
};

module.exports = enrolmentSchema