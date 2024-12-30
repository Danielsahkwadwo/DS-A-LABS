const { sanitize } = require("express-xss-sanitizer");

//testing for cross-site script vulnerability
describe("XSS Protection", () => {
  it("should sanitize inputs to prevent XSS", () => {
    const maliciousInput = `<script>alert('XSS');</script>`;
    const sanitizedInput = sanitize(maliciousInput);

    expect(sanitizedInput).not.toContain("<script>");
  });
});
