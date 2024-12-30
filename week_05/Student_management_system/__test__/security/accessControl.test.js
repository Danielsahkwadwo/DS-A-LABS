const { isInstructor } = require("../../Middlewares/authMiddleware");

// Mock request, response, and next
const mockRequest = {
  user: { id: "12345", role: "instructor" },
};
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const mockNext = jest.fn();

describe("Access Control", () => {
  it("should allow access to instructor route for instructor", () => {
    mockRequest.user.role = "instructor";

    isInstructor(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should deny access to instructor route for non-instructors", () => {
    mockRequest.user.role = "student";

    isInstructor(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error("Not authorized as an instructor"));
  });
});
