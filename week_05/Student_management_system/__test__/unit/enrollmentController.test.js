const {
  getEnrollments,
  createEnrollment,
  getStudentEnrollments,
  getStudentEnrolledInCourse,
  deleteEnrollmentByInstructor,
} = require("../../Controllers/enrolment");
const Course = require("../../Models/courses");
const Enrollment = require("../../Models/enrolment");
const Student = require("../../Models/students");
const AppError = require("../../Utils/AppError");

jest.mock("../../Models/courses");
jest.mock("../../Models/enrolment");
jest.mock("../../Models/students");

describe("Enrollment Controller Unit Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test the getEnrollments handler
   */
  describe("getEnrollments", () => {
    it("should return enrollments successfully", async () => {
      // Mock enrollments data
      const mockEnrollments = [{ id: 1 }, { id: 2 }];
      Enrollment.find.mockResolvedValue(mockEnrollments);

      // Mock request, response, and next
      const mockRequest = {};
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await getEnrollments(mockRequest, mockResponse, mockNext);
      // Check the response
      expect(Enrollment.find).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: { enrollments: mockEnrollments },
      });
    });

    it("should call mockNext with error if enrollments retrieval fails", async () => {
      //mock enrollments retrieval with null
      Enrollment.find.mockResolvedValue(null);

      // Mock request, response, and next
      const mockRequest = {};
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await getEnrollments(mockRequest, mockResponse, mockNext);
      // Check the response
      expect(Enrollment.find).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  /**
   * Test the createEnrollment handler
   */
  describe("createEnrollment", () => {
    it("should create an enrollment successfully", async () => {
      // Mock student, course, and enrollment
      const mockStudent = { id: "student1", coursesEnrolled: ["course1"], save: jest.fn() };
      const mockCourse = { id: "course1" };
      const mockEnrollment = { id: "enrollment1" };

      // Mock the findOne methods
      Student.findOne.mockResolvedValue(mockStudent);
      Course.findOne.mockResolvedValue(mockCourse);
      Enrollment.create.mockResolvedValue(mockEnrollment);
      // Mock request, response, and next
      const mockRequest = {
        body: { studentId: "student1", courseCode: "course1" },
      };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);
      // Check the response
      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "STUDENT1" });
      expect(Course.findOne).toHaveBeenCalledWith({ courseCode: "COURSE1" });
      expect(Enrollment.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockStudent.coursesEnrolled).toContain(mockCourse.id);
      expect(mockStudent.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: { enrollment: mockEnrollment },
      });
    });

    it("should call mockNext with error if required fields are missing", async () => {
      // Mock request, response, and next
      const mockRequest = { body: {} };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);
      // run assertion
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("should call mockNext with error if student does not exist", async () => {
      Student.findOne.mockResolvedValue(null);

      // Mock request, response, and next
      const mockRequest = { body: { studentId: "student1", courseCode: "course1" } };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);
      // run assertion
      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "STUDENT1" });
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("should call mockNext with error if course does not exist", async () => {
      const mockStudent = { id: "student1", coursesEnrolled: [] };
      // Mock the findOne methods
      Student.findOne.mockResolvedValue(mockStudent);
      Course.findOne.mockResolvedValue(null);
      // Mock request, response, and next
      const mockRequest = { body: { studentId: "student1", courseCode: "course1" } };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);
      // run assertion
      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "STUDENT1" });
      expect(Course.findOne).toHaveBeenCalledWith({ courseCode: "COURSE1" });
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    // it("should call mockNext with error if student is already enrolled in course", async () => {
    //   const mockStudent = {
    //     id: "student1",
    //     studentId: "STUDENT1",
    //     coursesEnrolled: ["course1"],
    //     save: jest.fn(),
    //   };
    //   const mockCourse = { id: "course1", courseCode: "MATH1" };

    //   const mockRequest = { body: { studentId: "student1", courseCode: "MATH1" } };
    //   const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    //   const mockNext = jest.fn();

    //   Student.findOne.mockResolvedValue(mockStudent);
    //   Course.findOne.mockResolvedValue(mockCourse);

    //   await createEnrollment(mockRequest, mockResponse, mockNext);

    //   expect(Student.findOne).toHaveBeenCalledWith({ studentId: "STUDENT1" });
    //   expect(Course.findOne).toHaveBeenCalledWith({ courseCode: "MATH1" });
    //   expect(mockStudent.coursesEnrolled).toContain(mockCourse.id);
    //   expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    // });
  });

  /**
   * Test to get all courses for a student
   */
  describe("getStudentEnrollments", () => {
    it("should return courses for the logged-in student", async () => {
      // Mock the aggregate method
      const mockCourses = [
        {
          _id: "enrollment1",
          courseCode: "COURSE1",
          courseName: "Course One",
          courseDescription: "Description of Course One",
          courseDuration: "10 weeks",
          credits: 3,
        },
      ];

      Enrollment.aggregate.mockResolvedValue(mockCourses);
      // Mock request, response, and next
      const mockRequest = {
        user: { role: "student", studentId: "student1" },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      // Call the getStudentEnrollments function
      await getStudentEnrollments(mockRequest, mockResponse, mockNext);
      // Run assertions
      expect(Enrollment.aggregate).toHaveBeenCalledWith([
        { $match: { studentId: "student1" } },
        {
          $lookup: {
            from: "courses",
            localField: "courseCode",
            foreignField: "courseCode",
            as: "course",
          },
        },
        { $unwind: "$course" },
        {
          $project: {
            _id: 1,
            courseCode: 1,
            courseName: "$course.courseName",
            courseDescription: "$course.courseDescription",
            courseDuration: "$course.courseDuration",
            credits: "$course.credits",
          },
        },
      ]);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: { courses: mockCourses },
      });
    });

    it("should call mockNext with error if no courses found", async () => {
      Enrollment.aggregate.mockResolvedValue(null);
      // Mock request, response, and next
      const mockRequest = {
        user: { role: "student", studentId: "student1" },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      await getStudentEnrollments(mockRequest, mockResponse, mockNext);
      // Run assertions
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  /**
   * Test to get all students enrolled in a course
   */
  describe("getStudentEnrolledInCourse", () => {
    it("should return students enrolled in a course", async () => {
      // Mock the aggregate method
      const mockStudents = [
        {
          _id: "enrollment1",
          studentId: "student1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          dateOfBirth: "2000-01-01",
          phoneNumber: "123456789",
          department: "Engineering",
          gender: "Male",
        },
      ];
      Enrollment.aggregate.mockResolvedValue(mockStudents);

      // Mock request, response, and next
      const req = { params: { courseCode: "COURSE1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getStudentEnrolledInCourse(req, res, next);

      // Run assertions
      expect(Enrollment.aggregate).toHaveBeenCalledWith([
        { $match: { courseCode: "COURSE1" } },
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "studentId",
            as: "student",
          },
        },
        { $unwind: "$student" },
        {
          $project: {
            _id: 1,
            studentId: 1,
            firstName: "$student.firstName",
            lastName: "$student.lastName",
            email: "$student.email",
            dateOfBirth: "$student.dateOfBirth",
            phoneNumber: "$student.phoneNumber",
            department: "$student.department",
            gender: "$student.gender",
          },
        },
      ]);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: { students: mockStudents },
      });
    });

    it("should call next with error if no students found", async () => {
      Enrollment.aggregate.mockResolvedValue(null);

      // Mock request, response, and next
      const req = { params: { courseCode: "COURSE1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await getStudentEnrolledInCourse(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  /**
   * Test to delete an enrollment
   */
  describe("deleteEnrollmentByInstructor", () => {
    it("should delete the enrollment and update the student successfully", async () => {
      // Mock enrollment data
      const mockEnrollment = {
        _id: "enrollment1",
        studentId: "student1",
        courseCode: "COURSE1",
      };

      // Mock course and student data
      const mockCourse = {
        _id: "course1",
        courseCode: "COURSE1",
      };

      const mockStudent = {
        studentId: "student1",
        coursesEnrolled: ["course1"],
        save: jest.fn(),
      };

      Enrollment.findByIdAndDelete.mockResolvedValue(mockEnrollment);
      Course.findOne.mockResolvedValue(mockCourse);
      Student.findOne.mockResolvedValue(mockStudent);

      // Mock request, response, and next
      const req = { params: { enrollmentId: "enrollment1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await deleteEnrollmentByInstructor(req, res, next);
      // Run assertions
      expect(Enrollment.findByIdAndDelete).toHaveBeenCalledWith("enrollment1");
      expect(Course.findOne).toHaveBeenCalledWith({
        courseCode: mockEnrollment.courseCode,
      });
      expect(Student.findOne).toHaveBeenCalledWith({
        studentId: mockEnrollment.studentId,
      });
      expect(mockStudent.coursesEnrolled).not.toContain(mockCourse._id);
      expect(mockStudent.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "enrolment deleted successfully",
      });
    });

    it("should call next with error if enrollment is not found", async () => {
      Enrollment.findByIdAndDelete.mockResolvedValue(null);

      // Mock request, response, and next
      const req = { params: { enrollmentId: "enrollment1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await deleteEnrollmentByInstructor(req, res, next);
      // Run assertions
      expect(Enrollment.findByIdAndDelete).toHaveBeenCalledWith("enrollment1");
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("should call next with error on unexpected exception", async () => {
      const mockError = new Error("Unexpected error");

      Enrollment.findByIdAndDelete.mockRejectedValue(mockError);
      // Mock request, response, and next
      const req = { params: { enrollmentId: "enrollment1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await deleteEnrollmentByInstructor(req, res, next);

      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
