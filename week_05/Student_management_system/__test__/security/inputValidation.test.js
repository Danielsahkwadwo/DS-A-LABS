const { isEmail } = require("validator");

describe("Input Validation and Sanitization", () => {
  it("should validate email addresses", () => {
    const validEmail = "test@example.com";
    const invalidEmail = "invalid-email";

    expect(isEmail(validEmail)).toBeTruthy();
    expect(isEmail(invalidEmail)).toBeFalsy();
  });
});
