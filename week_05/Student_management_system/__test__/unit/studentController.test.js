const Student = require("../../Models/students");
const { createJWT } = require("../../Utils/createJWT");
const { createToken, hashToken } = require("../../Utils/createToken");
const mergeSort = require("../../helpers/mergeSort");
const {
  addStudent,
  getStudent,
  getStudents,
  getSelf,
  updateStudent,
  deleteStudent,
  loginStudent,
  sortStudents,
  forgotPassword,
  passwordReset,
} = require("./../../Controllers/students");
const AppError = require("./../../Utils/AppError");
const APIFeatures = require("./../../Utils/apiFeatures");

jest.mock("../../Models/students");
jest.mock("../../Utils/apiFeatures");
jest.mock("../../Utils/createJWT");
jest.mock("../../helpers/mergeSort");
jest.mock("../../Utils/createToken");

describe("student handlers", () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  // Set up mock objects
  beforeEach(() => {
    // Mock request, response, and next
    mockRequest = {
      body: {
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        email: "9yt8o@example.com",
        phoneNumber: "1234567890",
        password: "password123",
        gender: "male",
        department: "Computer Science",
        role: "student",
        studentId: "ueb3512920",
      },
      query: {},
      params: {
        email: "student@example.com",
        token: "reset-token",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test the add student handler
   */
  describe("add student handler", () => {
    it("should call next with an error if required fields are missing", async () => {
      mockRequest.body = {}; // Missing all fields
      await addStudent(mockRequest, mockResponse, mockNext);

      // Expect next to be called with an error
      expect(mockNext).toHaveBeenCalledWith(new AppError("All fields are required", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    test("should create a new student and return a 201 status with user data", async () => {
      //mock student data
      const mockStudent = {
        ...mockRequest.body,
        email: mockRequest.body.email.toLowerCase(),
        studentId: mockRequest.body.studentId.toLowerCase(),
      };
      //mock create student function
      Student.create.mockResolvedValue(mockStudent);

      await addStudent(mockRequest, mockResponse, mockNext);
      // run assertion
      expect(Student.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          student: mockStudent,
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("should handle errors and return a 400 status with error message", async () => {
      //mock error message
      const mockError = new Error("validation error");
      Student.create.mockRejectedValue(mockError);

      await addStudent(mockRequest, mockResponse, mockNext);
      // run assertion
      expect(Student.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockNext).toHaveBeenCalledWith(new AppError(mockError.message, 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should call next with an error if email or studentId already exists", async () => {
      // Mock a duplicate key error
      const duplicateKeyError = new Error("E11000 duplicate key error collection");
      duplicateKeyError.code = 11000;

      Student.create.mockRejectedValue(duplicateKeyError);

      await addStudent(mockRequest, mockResponse, mockNext);
      //run assertions
      expect(mockNext).toHaveBeenCalledWith(new AppError("Email or student ID already exists", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  /**
   * Test the getStudent handler
   */
  describe("get student handler", () => {
    it("should return student data when a valid ID is provided", async () => {
      // Mock student data
      const mockStudent = {
        id: "1234567890abcdef12345678",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        gender: "male",
        department: "Computer Science",
      };
      mockRequest.params = { id: "1234567890abcdef12345678" };
      const mockSelect = jest.fn().mockResolvedValue(mockStudent);
      // Mock the findById method
      Student.findById.mockReturnValue({ select: mockSelect });

      await getStudent(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findById).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          student: mockStudent,
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with a 404 error if student is not found", async () => {
      // Mock no student found
      mockRequest.params = { id: "nonexistentID" };
      const mockSelect = jest.fn().mockResolvedValue(null);
      Student.findById.mockReturnValue({ select: mockSelect });

      await getStudent(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findById).toHaveBeenCalledWith("nonexistentID");
      expect(mockNext).toHaveBeenCalledWith(new AppError("No student found", 404));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  /**
   * Test the get all students handler
   */
  //   describe("get all students handler", () => {
  //     test("should return a list of all students with a 200 status", async () => {
  //       const mockStudents = [
  //         {
  //           id: "1234567890abcdef12345678",
  //           firstName: "John",
  //           lastName: "Doe",
  //           email: "johndoe@example.com",
  //           gender: "male",
  //           department: "Computer Science",
  //         },
  //         {
  //           id: "234567890abcdef12345678",
  //           firstName: "Jane",
  //           lastName: "Doe",
  //           email: "iV2YX@example.com",
  //           gender: "female",
  //           department: "Computer Science",
  //         },
  //       ];

  //       const mockAPIFeatures = {
  //         filter: jest.fn().mockReturnThis(),
  //         paginate: jest.fn().mockReturnThis(),
  //         query: jest.fn().mockResolvedValue(mockStudents),
  //       };

  //       APIFeatures.mockImplementation(() => mockAPIFeatures);

  //       const mockSelect = jest.fn().mockResolvedValue(mockStudents);
  //       //   Student.find.mockReturnValue({ select: mockSelect });

  //       await getStudents(mockRequest, mockResponse, mockNext);
  //       const findStudent = Student.find.mockReturnValue({ select: mockSelect });

  //       expect(APIFeatures).toHaveBeenCalledWith(findStudent, mockRequest.query);
  //       expect(mockAPIFeatures.filter).toHaveBeenCalled();
  //       expect(mockAPIFeatures.paginate).toHaveBeenCalled();
  //       expect(mockAPIFeatures.query).toBeInstanceOf(Function);

  //       expect(mockResponse.status).toHaveBeenCalledWith(200);
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         status: "success",
  //         results: mockStudents.length,
  //         data: {
  //           students: mockStudents,
  //         },
  //       });
  //       expect(mockNext).not.toHaveBeenCalled();
  //     });
  //   });

  /**
   * Test the get self handler
   */
  describe("get self handler", () => {
    it("should return the student with a 200 status", async () => {
      // Mock student data
      const mockStudent = {
        _id: "1",
        firstName: "John",
        lastName: "Doe",
        studentId: "ueb3512920",
        email: "john.doe@example.com",
      };

      // Mock the authenticated user
      mockRequest = {
        user: {
          studentId: "ueb3512920",
        },
      };
      // Mock the findOne method to resolve with a student
      Student.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStudent),
      });

      await getSelf(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "ueb3512920" });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          student: mockStudent,
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with a 404 error if no student is found", async () => {
      mockRequest = {
        user: {
          studentId: "ueb3512920", // Mock studentId from the authenticated user
        },
      };
      // Mock the findOne method to resolve with null
      const selectMock = jest.fn().mockResolvedValue(null); // Simulate no student found
      Student.findOne = jest.fn(() => ({
        select: selectMock,
      }));

      await getSelf(mockRequest, mockResponse, mockNext);

      expect(Student.findOne).toHaveBeenCalledWith({ studentId: "ueb3512920" });
      expect(mockNext).toHaveBeenCalledWith(new AppError("No student found", 404));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  /**
   * Test the update student handler
   */
  describe("update student handler", () => {
    it("should update a student and return a 200 status", async () => {
      // Mock student data
      const mockStudent = {
        id: "1234567890abcdef12345678",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        gender: "male",
        department: "Computer Science",
      };
      // Mock request, response, and next
      mockRequest = {
        body: {
          firstName: "Jane",
          lastName: "Doe",
          email: "iV2YX@example.com",
          gender: "female",
          department: "Computer Science",
        },
        params: {
          id: "1234567890abcdef12345678",
        },
      };

      Student.findByIdAndUpdate.mockResolvedValue(mockStudent);

      await updateStudent(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findByIdAndUpdate).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockRequest.body,
        expect.any(Object)
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          student: mockStudent,
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with a 404 error if no student is found", async () => {
      // Mock request, response, and next
      mockRequest = {
        params: {
          id: "1234567890abcdef12345678",
        },
      };

      Student.findByIdAndUpdate.mockResolvedValue(null);

      await updateStudent(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findByIdAndUpdate).toHaveBeenCalledWith(
        mockRequest.params.id,
        mockRequest.body,
        expect.any(Object)
      );
      expect(mockNext).toHaveBeenCalledWith(new AppError("No student found", 404));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  /**
   * Test the delete student handler
   */
  describe("delete student handler", () => {
    it("should delete a student and return a 204 status", async () => {
      // Mock request
      mockRequest = {
        params: {
          id: "1234567890abcdef12345678",
        },
      };

      Student.findByIdAndDelete.mockResolvedValue({});

      await deleteStudent(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findByIdAndDelete).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with a 404 error if no student is found", async () => {
      // Mock request
      mockRequest = {
        params: {
          id: "1234567890abcdef12345678",
        },
      };

      Student.findByIdAndDelete.mockResolvedValue(null);

      await deleteStudent(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findByIdAndDelete).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockNext).toHaveBeenCalledWith(new AppError("No student found", 404));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  /*
   *Test to login Student
   */
  describe("login student handler", () => {
    it("should login a student and return a 200 status", async () => {
      // Mock student data
      const mockStudent = {
        id: "1234567890abcdef12345678",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        gender: "male",
        department: "Computer Science",
        comparePassword: jest.fn(),
      };

      // Mock request
      mockRequest = {
        body: {
          email: "johndoe@example.com",
          password: "password123",
        },
      };

      Student.findOne.mockResolvedValue(mockStudent);
      // Mock comparePassword to return true (password match)
      mockStudent.comparePassword.mockResolvedValue(true);
      // Mock createJWT to return a mock token
      createJWT.mockReturnValue("mockToken123");
      await loginStudent(mockRequest, mockResponse, mockNext);

      //       run assertions
      expect(Student.findOne).toHaveBeenCalledWith({ email: "johndoe@example.com" });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          student: mockStudent,
          token: "mockToken123",
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 if password does not match", async () => {
      const mockStudent = {
        email: "test@student.com",
        comparePassword: jest.fn(),
      };
      // Mock the findOne method to return a student
      Student.findOne.mockResolvedValue(mockStudent);
      // Mock comparePassword to return false (password mismatch)
      mockStudent.comparePassword.mockResolvedValue(false);
      await loginStudent(mockRequest, mockResponse, mockNext);

      // Check that next was called with a 401 error for invalid email/password
      expect(mockNext).toHaveBeenCalledWith(new AppError("Invalid email or password", 401));
    });

    it("should return 401 if student is not found", async () => {
      // Mock the findOne method to return null (no student found)
      Student.findOne.mockResolvedValue(null);

      await loginStudent(mockRequest, mockResponse, mockNext);

      // Check that next was called with a 401 error for invalid email/password
      expect(mockNext).toHaveBeenCalledWith(new AppError("Invalid email or password", 401));
    });

    it("should return 400 if email or password is missing", async () => {
      mockRequest.body = { email: "", password: "" }; // Simulate missing email and password

      await loginStudent(mockRequest, mockResponse, mockNext);

      // Check that next was called with a 400 error
      expect(mockNext).toHaveBeenCalledWith(new AppError("All fields are required", 400));
    });
  });

  /**
   * Test to sort students data
   */
  describe("sort students handler", () => {
    it("should call next with a 400 error if sortBy is not provided", async () => {
      // Mock request without sortBy parameter
      await sortStudents(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(mockNext).toHaveBeenCalledWith(new AppError("Please provide a sort criteria", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should call next with a 400 error if order is invalid", async () => {
      // Mock request without sortBy parameter
      mockRequest.query = { sortBy: "name", order: "invalid" };

      await sortStudents(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(mockNext).toHaveBeenCalledWith(new AppError("Please provide a valid order. either asc or desc", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should return sorted students when valid sortBy and order are provided", async () => {
      mockRequest.query = { sortBy: "name", order: "asc" };
      // Mock student data
      const mockStudents = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 22 },
      ];

      const mockSortedStudents = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 22 },
      ];

      // Mock student model
      Student.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockStudents),
      });

      mergeSort.mockReturnValue(mockSortedStudents);

      await sortStudents(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.find).toHaveBeenCalled();
      expect(mergeSort).toHaveBeenCalledWith(mockStudents, "name", "asc");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        fields: "name",
        order: "asc",
        data: [...mockSortedStudents],
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should call next with a 404 error if no students are found", async () => {
      mockRequest.query = { sortBy: "name" };

      Student.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await sortStudents(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(mockNext).toHaveBeenCalledWith(new AppError("No students found", 404));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  /**
   * Test to forgot password
   */
  describe("forgot password handler", () => {
    it("should call next with a 400 error if email is not provided", async () => {
      // Mock request without email
      mockRequest = {
        body: {},
      };
      await forgotPassword(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(mockNext).toHaveBeenCalledWith(new AppError("Email is required", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should call next with a 404 error if no student is found with the provided email", async () => {
      // Mock request with non-existent email
      mockRequest.body = { email: "nonexistent@example.com" };

      Student.findOne.mockResolvedValue(null);

      await forgotPassword(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findOne).toHaveBeenCalledWith({ email: "nonexistent@example.com" });
      expect(mockNext).toHaveBeenCalledWith(new AppError("No student found", 404));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should generate a reset token, hash it, save it to the student, and respond with the token", async () => {
      // Mock request with email
      mockRequest.body = { email: "student@example.com" };
      // Mock student
      const mockStudent = {
        email: "student@example.com",
        save: jest.fn(),
      };

      const mockResetToken = "reset-token";
      const mockHashedToken = "hashed-reset-token";
      // Mock functions
      Student.findOne.mockResolvedValue(mockStudent);
      createToken.mockReturnValue(mockResetToken);
      hashToken.mockReturnValue(mockHashedToken);

      await forgotPassword(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findOne).toHaveBeenCalledWith({ email: "student@example.com" });
      expect(createToken).toHaveBeenCalled();
      expect(hashToken).toHaveBeenCalledWith(mockResetToken);
      expect(mockStudent.resetToken).toBe(mockHashedToken);
      expect(mockStudent.resetTokenExpires).toBeDefined();
      expect(mockStudent.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        token: mockResetToken,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  /**
   * Test to reset password
   */
  describe("reset password handler", () => {
    it("should call next with a 400 error if passwords are not provided", async () => {
      //mock request
      mockRequest.body = {};

      await passwordReset(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(mockNext).toHaveBeenCalledWith(new AppError("Password is required", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should call next with a 400 error if passwords do not match", async () => {
      //mock request
      mockRequest.body = {
        newPassword: "password123",
        confirmPassword: "password456",
      };

      await passwordReset(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(mockNext).toHaveBeenCalledWith(new AppError("Passwords do not match", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should call next with a 404 error if no student is found with the email", async () => {
      Student.findOne.mockResolvedValue(null);
      // Set up mock request
      mockRequest = {
        params: {
          email: "student@example.com", // Ensure email matches the handler's query
        },
        body: {
          newPassword: "newStrongPassword123",
          confirmPassword: "newStrongPassword123",
        },
      };

      await passwordReset(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findOne).toHaveBeenCalledWith({ email: "student@example.com" });
      expect(mockNext).toHaveBeenCalledWith(new AppError("No student found", 404));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should call next with a 400 error if token is invalid or expired", async () => {
      // Mock student
      const mockStudent = {
        email: "student@example.com",
        resetToken: "hashed-reset-token",
        resetTokenExpiration: Date.now() - 1000, // Expired token
        save: jest.fn(),
      };

      // Ensure mockRequest includes necessary params and body
      mockRequest = {
        params: {
          email: "student@example.com",
          token: "reset-token",
        },
        body: {
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
        },
      };

      Student.findOne.mockResolvedValue(mockStudent);
      hashToken.mockReturnValue("hashed-reset-token");

      await passwordReset(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(Student.findOne).toHaveBeenCalledWith({ email: "student@example.com" });
      expect(hashToken).toHaveBeenCalledWith("reset-token");
      expect(mockNext).toHaveBeenCalledWith(new AppError("Invalid token or token has expired", 400));
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should reset the password and respond with success", async () => {
      // Mock student
      const mockStudent = {
        email: "student@example.com",
        resetToken: "hashed-reset-token",
        resetTokenExpiration: Date.now() + 1000, // Valid token
        save: jest.fn(),
      };
      // Ensure mockRequest includes necessary params and body
      mockRequest = {
        params: {
          email: "student@example.com",
          token: "reset-token",
        },
        body: {
          newPassword: "newPassword123",
          confirmPassword: "newPassword123",
        },
      };
      Student.findOne.mockResolvedValue(mockStudent);
      hashToken.mockReturnValue("hashed-reset-token");

      await passwordReset(mockRequest, mockResponse, mockNext);
      //       run assertions
      expect(hashToken).toHaveBeenCalledWith("reset-token");
      expect(mockStudent.password).toBe("newPassword123");
      expect(mockStudent.resetToken).toBeNull();
      expect(mockStudent.resetTokenExpiration).toBeNull();
      expect(mockStudent.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        message: "Password reset successfully",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
