const { getEnrollments, createEnrollment } = require("../../Controllers/enrolment");
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

  describe("getEnrollments", () => {
    it("should return enrollments successfully", async () => {
      const mockEnrollments = [{ id: 1 }, { id: 2 }];
      Enrollment.find.mockResolvedValue(mockEnrollments);

      const mockRequest = {};
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await getEnrollments(mockRequest, mockResponse, mockNext);

      expect(Enrollment.find).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: { enrollments: mockEnrollments },
      });
    });

    it("should call mockNext with error if enrollments retrieval fails", async () => {
      Enrollment.find.mockResolvedValue(null);

      const mockRequest = {};
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await getEnrollments(mockRequest, mockResponse, mockNext);

      expect(Enrollment.find).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  describe("createEnrollment", () => {
    it("should create an enrollment successfully", async () => {
      const mockStudent = { id: "student1", coursesEnrolled: ["course1"], save: jest.fn() };
      const mockCourse = { id: "course1" };
      const mockEnrollment = { id: "enrollment1" };

      Student.findOne.mockResolvedValue(mockStudent);
      Course.findOne.mockResolvedValue(mockCourse);
      Enrollment.create.mockResolvedValue(mockEnrollment);

      const mockRequest = {
        body: { studentId: "student1", courseCode: "course1" },
      };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);

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
      const mockRequest = { body: {} };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("should call mockNext with error if student does not exist", async () => {
      Student.findOne.mockResolvedValue(null);

      const mockRequest = { body: { studentId: "student1", courseCode: "course1" } };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);

      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "STUDENT1" });
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("should call mockNext with error if course does not exist", async () => {
      const mockStudent = { id: "student1", coursesEnrolled: [] };

      Student.findOne.mockResolvedValue(mockStudent);
      Course.findOne.mockResolvedValue(null);

      const mockRequest = { body: { studentId: "student1", courseCode: "course1" } };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      await createEnrollment(mockRequest, mockResponse, mockNext);

      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "STUDENT1" });
      expect(Course.findOne).toHaveBeenCalledWith({ courseCode: "COURSE1" });
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });

    it("should call mockNext with error if student is already enrolled in course", async () => {
      const mockStudent = {
        id: "student1",
        studentId: "STUDENT1",
        coursesEnrolled: ["course1"],
        save: jest.fn(),
      };
      const mockCourse = { id: "course1", courseCode: "MATH1" };

      const mockRequest = { body: { studentId: "student1", courseCode: "MATH1" } };
      const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockNext = jest.fn();

      Student.findOne.mockResolvedValue(mockStudent);
      Course.findOne.mockResolvedValue(mockCourse);

      await createEnrollment(mockRequest, mockResponse, mockNext);

      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "STUDENT1" });
      expect(Course.findOne).toHaveBeenCalledWith({ courseCode: "MATH1" });
      expect(mockStudent.coursesEnrolled).toContain(mockCourse.id); 
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
