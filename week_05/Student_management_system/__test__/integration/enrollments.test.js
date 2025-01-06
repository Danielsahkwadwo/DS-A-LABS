const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Course = require("../../Models/courses");
const Enrollment = require("../../Models/enrolment");
const Student = require("../../Models/students");
const { app, server } = require("../../server");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT tokens
const generateToken = (user, role = "student") => {
  return jwt.sign({ id: user._id, role }, process.env.JWT_SECRET || "testsecret", { expiresIn: "1h" });
};

// let server;
let mongoServer;
let PATH = "/api/v1/enrollments";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  server.close();
});

afterEach(async () => {
  await Student.deleteMany();
  await Course.deleteMany();
  await Enrollment.deleteMany();
});

describe("POST /enrollments - course enrollment", () => {
  //test for unauthorized enrollment
  test("should return 401 if user is not authorized", async () => {
    const response = await request(app).post(PATH).send({ studentId: "STUDENT001", courseCode: "COURSE101" });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("you are not logged in");
  });

  //test for unauthorized enrollment
  test("should return 401 if user is not an instructor", async () => {
    const student = await Student.create({
      studentId: "STUDENT001",
      coursesEnrolled: [],
      department: "Computer Science",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      gender: "male",
    });
    const course = await Course.create({
      courseCode: "COURSE101",
      courseName: "Introduction to Testing",
      courseDescription: "Learn the basics of software testing",
      credits: 3,
      courseDuration: "12 weeks",
      department: "Computer Science",
      semester: 1,
      instructorId: new mongoose.Types.ObjectId(),
    });

    const token = generateToken(student, "student"); // Generate token with 'student' role

    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${token}`)
      .send({ studentId: student.studentId, courseCode: course.courseCode });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Not authorized as an instructor");
  });

  test("should create enrollment successfully", async () => {
    const course = await Course.create({
      courseCode: "COURSE101",
      instructorId: new mongoose.Types.ObjectId(),
      department: "Computer Science",
      courseName: "Introduction to Testing",
      courseDescription: "Learn the basics of software testing",
      credits: 3,
      courseDuration: "12 weeks",
      semester: 1,
    });
    const student = await Student.create({
      studentId: "STUDENT001",
      coursesEnrolled: [],
      department: "Computer Science",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      gender: "male",
    });

    const instructorToken = generateToken({ _id: new mongoose.Types.ObjectId() }, "instructor");

    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({ studentId: student.studentId, courseCode: course.courseCode });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.enrollment.studentId).toBe(student.studentId);
    expect(response.body.data.enrollment.courseCode).toBe(course.courseCode);

    // Verify student update
    const updatedStudent = await Student.findById(student._id);
    expect(updatedStudent.coursesEnrolled).toContainEqual(course._id);
  });

  test("should handle duplicate enrollments", async () => {
    const course = await Course.create({
      courseCode: "COURSE101",
      instructorId: new mongoose.Types.ObjectId(),
      department: "Computer Science",
      courseName: "Introduction to Testing",
      courseDescription: "Learn the basics of software testing",
      credits: 3,
      courseDuration: "12 weeks",
      semester: 1,
    });
    const student = await Student.create({
      studentId: "STUDENT001",
      coursesEnrolled: [course._id],
      department: "Computer Science",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      gender: "male",
    });

    const instructorToken = generateToken({ _id: new mongoose.Types.ObjectId() }, "instructor");

    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({ studentId: student.studentId, courseCode: course.courseCode });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("student is already enrolled in this course");
  });
});

describe("GET /api/v1/enrollments - getEnrollments", () => {
  test("should return all enrollments successfully", async () => {
    // Seed test data
    await Enrollment.create([
      { studentId: new mongoose.Types.ObjectId(), courseId: new mongoose.Types.ObjectId(), courseCode: "COURSE101" },
      { studentId: new mongoose.Types.ObjectId(), courseId: new mongoose.Types.ObjectId(), courseCode: "COURSE102" },
    ]);
    const token = generateToken({ id: "instructor123" }, "instructor");

    const response = await request(app).get(PATH).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.enrollments.length).toBe(2);
  });

  test("should return empty array if no enrollments exist", async () => {
    const token = generateToken({ id: "instructor123" }, "instructor");

    const response = await request(app).get(PATH).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.enrollments).toStrictEqual([]);
  });

  test("should return 403 if no authorization token is provided", async () => {
    const response = await request(app).get(PATH);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("you are not logged in");
  });
});
