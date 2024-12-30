const { sanitize } = require("express-xss-sanitizer");

//testing for cross-site script vulnerability
describe("XSS Protection", () => {
  it("should sanitize inputs to prevent XSS", () => {
    // Create a malicious input
    const maliciousInput = `<script>alert('XSS');</script>`;
    const sanitizedInput = sanitize(maliciousInput);
    //check if the input is sanitized
    expect(sanitizedInput).not.toContain("<script>");
  });
});
