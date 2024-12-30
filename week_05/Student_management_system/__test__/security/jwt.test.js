const jwt = require("jsonwebtoken");
const { createJWT } = require("../../Utils/createJWT");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

describe("JWT Security Testing", () => {
  it("should generate a valid JWT token with correct payload", () => {
    const payload = { id: "12345", role: "user", studentId: "ueb3512920" };
    const token = createJWT(payload.id, payload.role, payload.studentId);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.role).toBe(payload.role);
    expect(decoded.studentId).toBe(payload.studentId);
  });

  it("should not validate a token with incorrect secret", () => {
    const payload = { id: "12345", role: "user" };
    const token = createJWT(payload.id, payload.role, null);

    expect(() => jwt.verify(token, "wrong-secret")).toThrow(jwt.JsonWebTokenError);
  });

  it("should reject expired tokens", () => {
    const token = jwt.sign({ id: "12345", role: "user" }, process.env.JWT_SECRET, { expiresIn: "1ms" });

    setTimeout(() => {
      expect(() => jwt.verify(token, process.env.JWT_SECRET)).toThrow(jwt.TokenExpiredError);
    }, 10);
  });
});