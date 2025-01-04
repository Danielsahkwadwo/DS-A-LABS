const authMiddleware = require("../../Middlewares/authMiddleware");
const auth = authMiddleware.isAuthorized;
const JWT = require("jsonwebtoken");
const AppError = require("../../Utils/AppError");

// Mock the jsonwebtoken library
jest.mock("jsonwebtoken");

describe("protected middleware", () => {
  it("should allow access if a valid token is provided", async () => {
    const mockDecodedToken = { id: "user1", role: "student" };
    JWT.verify.mockReturnValue(mockDecodedToken);

    // Mock the request object
    const mockRequest = {
      headers: {
        authorization: "Bearer validToken",
      },
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    // Call the protected middleware
    await auth(mockRequest, mockResponse, mockNext);

    // run assertions
    expect(JWT.verify).toHaveBeenCalledWith("validToken", process.env.JWT_SECRET);
    expect(mockRequest.user).toEqual(mockDecodedToken);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should call mockNext with an error if no token is provided", async () => {
    // Mock the request object
    const mockRequest = { headers: {} };
    const mockResponse = {};
    const mockNext = jest.fn();

    // Call the protected middleware
    await auth(mockRequest, mockResponse, mockNext);

    // run assertions
    expect(JWT.verify).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0];
    expect(error.message).toBe("you are not logged in");
    expect(error.statusCode).toBe(401);
  });

  it("should call mockNext with an error if the token is invalid", async () => {
    // Mock the request object
    const mockRequest = {
      headers: {
        authorization: "Bearer invalidToken",
      },
    };
    // Mock the response object
    const mockResponse = { status: jest.fn() };
    // Mock the next function
    const mockNext = jest.fn();

    // Mock the JWT.verify function
    JWT.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Call the protected middleware
    await auth(mockRequest, mockResponse, mockNext);

    // run assertions
    expect(JWT.verify).toHaveBeenCalledWith("invalidToken", process.env.JWT_SECRET);
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call mockNext with an error if the authorization header is malformed", async () => {
    // Mock the request object
    const mockRequest = {
      headers: {
        authorization: "InvalidHeaderFormat",
      },
    };
    // Mock the response object
    const mockResponse = {};
    // Mock the next function
    const mockNext = jest.fn();

    // Call the protected middleware
    await auth(mockRequest, mockResponse, mockNext);

    // run assertions
    expect(JWT.verify).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    const error = mockNext.mock.calls[0][0];
    expect(error.message).toBe("you are not logged in");
    expect(error.statusCode).toBe(401);
  });
});
