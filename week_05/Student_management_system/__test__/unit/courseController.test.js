const {
  createCourse,
  getCourseDetails,
  updateCourse,
  deleteCourse,
  sortCourses,
} = require("../../Controllers/courses");
const mergeSort = require("../../helpers/mergeSort");
const Course = require("../../Models/courses");
const AppError = require("../../Utils/AppError");

jest.mock("../../Models/courses");
jest.mock("../../helpers/mergeSort");

/**
 * Test cases for creating course handler
 */
describe("createCourse Controller", () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {
      body: {
        courseName: "Mathematics",
        courseCode: "math101",
        courseDescription: "Basic math course",
        credits: 3,
        courseDuration: "6 months",
        department: "Science",
        semester: 1,
      },
      user: {
        id: "12345",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("should create a course successfully", async () => {
    const mockCourse = {
      _id: "courseId",
      ...mockRequest.body,
      instructorId: mockRequest.user.id,
    };

    Course.create.mockResolvedValue(mockCourse);
    mockCourse.populate = jest.fn().mockResolvedValue({
      instructorId: {
        coursesTaught: [],
        save: jest.fn(),
      },
    });

    await createCourse(mockRequest, mockResponse, mockNext);

    expect(Course.create).toHaveBeenCalledWith({
      ...mockRequest.body,
      courseCode: "MATH101",
      instructorId: mockRequest.user.id,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      data: { course: mockCourse },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return an error if required fields are missing", async () => {
    mockRequest.body = {}; // Missing fields

    await createCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("Please provide all required fields", 400));
    expect(Course.create).not.toHaveBeenCalled();
  });

  it("should handle duplicate course errors", async () => {
    Course.create.mockRejectedValue({ code: 11000 });

    await createCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("Course already exists", 400));
  });

  it("should handle unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    Course.create.mockRejectedValue(mockError);

    await createCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});

/**
 * Test cases for getting course details handler
 */
describe("getCourseDetails Controller", () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {
      params: {
        courseCode: "math101",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it("should retrieve course details successfully", async () => {
    const mockCourse = {
      _id: "courseId",
      courseName: "Mathematics",
      courseCode: "MATH101",
    };

    Course.find.mockResolvedValue([mockCourse]);

    await getCourseDetails(mockRequest, mockResponse, mockNext);

    expect(Course.find).toHaveBeenCalledWith({ courseCode: "MATH101" });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      data: { course: [mockCourse] },
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return an error if no course is found", async () => {
    Course.find.mockResolvedValue(null);

    await getCourseDetails(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("an error occurred while getting course", 400));
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    Course.find.mockRejectedValue(mockError);

    await getCourseDetails(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});

/**
 * Test cases for updating course handler
 */
describe("updateCourse Controller", () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {
      params: { courseCode: "math101" },
      body: { courseName: "Updated Math" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should update a course successfully", async () => {
    const mockCourse = { courseName: "Updated Math", courseCode: "MATH101" };
    Course.findOneAndUpdate.mockResolvedValue(mockCourse);

    await updateCourse(mockRequest, mockResponse, mockNext);

    expect(Course.findOneAndUpdate).toHaveBeenCalledWith({ courseCode: "MATH101" }, mockRequest.body, {
      new: true,
      runValidators: true,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      data: { course: mockCourse },
    });
  });

  it("should return an error if course is not found", async () => {
    Course.findOneAndUpdate.mockResolvedValue(null);

    await updateCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("course with this courseCode not found", 404));
  });

  it("should handle unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    Course.findOneAndUpdate.mockRejectedValue(mockError);

    await updateCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});

/**
 * Test cases for deleting course handler
 */
describe("deleteCourse Controller", () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {
      params: { courseCode: "math101" },
      user: { id: "12345" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should delete a course successfully", async () => {
    const mockCourse = {
      _id: "courseId",
      instructorId: "12345",
      populate: jest.fn().mockResolvedValue({
        instructorId: { coursesTaught: ["courseId"], save: jest.fn() },
      }),
    };
    Course.findOne.mockResolvedValue(mockCourse);
    Course.deleteOne.mockResolvedValue({ deletedCount: 1 });

    await deleteCourse(mockRequest, mockResponse, mockNext);

    expect(Course.findOne).toHaveBeenCalledWith({ courseCode: "MATH101" });
    expect(Course.deleteOne).toHaveBeenCalledWith({ courseCode: "MATH101" });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      message: "course deleted successfully",
    });
  });

  it("should return an error if course is not found", async () => {
    Course.findOne.mockResolvedValue(null);

    await deleteCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("course with this courseCode not found", 404));
  });

  it("should return an error if user is not authorized to delete the course", async () => {
    const mockCourse = { instructorId: "67890" };
    Course.findOne.mockResolvedValue(mockCourse);

    await deleteCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("You are not authorized to delete this course", 401));
  });

  it("should handle unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    Course.findOne.mockRejectedValue(mockError);

    await deleteCourse(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});

/**
 * Test cases for sorting courses
 */
describe("sortCourses Controller", () => {
  let mockRequest, mockResponse, mockNext;

  beforeEach(() => {
    mockRequest = {
      query: { sortBy: "courseName", order: "asc" },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it("should sort courses successfully", async () => {
    const mockCourses = [{ courseName: "Math" }, { courseName: "Science" }];
    const sortedCourses = [{ courseName: "Math" }, { courseName: "Science" }];
    Course.find.mockResolvedValue(mockCourses);
    mergeSort.mockReturnValue(sortedCourses);

    await sortCourses(mockRequest, mockResponse, mockNext);

    expect(Course.find).toHaveBeenCalled();
    expect(mergeSort).toHaveBeenCalledWith(mockCourses, "courseName", "asc");
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      fields: "courseName",
      order: "asc",
      data: sortedCourses,
    });
  });

  it("should return an error if sortBy is not provided", async () => {
    mockRequest.query.sortBy = undefined;

    await sortCourses(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("Please provide a sort criteria", 400));
  });

  it("should return an error for invalid order", async () => {
    mockRequest.query.order = "invalid";

    await sortCourses(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new AppError("Please provide a valid order. either asc or desc", 400));
  });

  it("should handle unexpected errors", async () => {
    const mockError = new Error("Unexpected error");
    Course.find.mockRejectedValue(mockError);

    await sortCourses(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
