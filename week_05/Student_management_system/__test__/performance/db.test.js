// const request = require("supertest");
// const app = require("../../server");

const mongoose = require("mongoose");
const Student = require("../../Models/students");

describe("Performance: Database Query Efficiency", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/performance_test").catch((err) => console.log(err.message));
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should query 1000 students in under 100ms", async () => {
    // Seed the database with test data
    await Student.insertMany(
      Array.from({ length: 1000 }, (_, i) => ({
        firstName: `Student${i}`,
        lastName: `Student${i}`,
        email: `student${i}@example.com`,
        gender: "male",
        department: "Computer Science",
        dateOfBirth: "1990-01-01",
        phoneNumber: "1234567890",
        password: "password123",
        studentId: `ueb3512${i}`,
      }))
    );

    const startTime = Date.now();
    const students = await Student.find();
    const endTime = Date.now();

    expect(students.length).toBe(1000);
    expect(endTime - startTime).toBeLessThan(100); // Assert query time < 100ms
  });
});