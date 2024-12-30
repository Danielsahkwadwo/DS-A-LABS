const JWT = require("jsonwebtoken");
const { createJWT } = require("../../Utils/createJWT");


jest.mock("jsonwebtoken");

describe("create Json Web Token", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRY = "1h";
  });

  it("should create a JWT token with the correct payload and options", () => {
    // Arrange
    const mockId = "12345";
    const mockRole = "student";
    const mockStudentId = "ueb3512920";
    const mockToken = "mock.jwt.token";

    // Mock JWT.sign to return a mock token
    JWT.sign.mockReturnValue(mockToken);

    // Act
    const result = createJWT(mockId, mockRole, mockStudentId);

    // Assert
    expect(JWT.sign).toHaveBeenCalledWith(
      { id: mockId, role: mockRole, studentId: mockStudentId },
      "test-secret",
      { expiresIn: "1h" }
    );
    expect(result).toBe(mockToken);
  });

  it("should throw an error if JWT.sign fails", () => {
    // Arrange
    const mockId = "12345";
    const mockRole = "student";
    const mockStudentId = "ueb3512920";

    // Mock JWT.sign to throw an error
    JWT.sign.mockImplementation(() => {
      throw new Error("JWT signing failed");
    });

    // Act & Assert
    expect(() => createJWT(mockId, mockRole, mockStudentId)).toThrow(
      "JWT signing failed"
    );
  });
});
