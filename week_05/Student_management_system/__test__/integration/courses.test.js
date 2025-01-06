const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Course = require("../../Models/courses");
const Instructor = require("../../Models/Instructor");
const { app, server } = require("../../server");
const jwt = require("jsonwebtoken");

// Generate a mock token for testing
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET || "testsecret", {
    expiresIn: "1h",
  });
};

// let server;
let mongoServer;
let PATH = "/api/v1/courses";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  await Course.createIndexes();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  server.close();
});

afterEach(async () => {
  await Course.deleteMany();
});

describe("POST /courses - createCourse", () => {
  it("should create a course and return 201 status", async () => {
    // Create an instructor in the database
    const instructor = await Instructor.create({
      firstName: "John Doe",
      lastName: "Doe",
      email: "instructor@example.com",
      role: "instructor",
      password: "password123",
      department: "Computer Science",
      phoneNumber: "1234567890",
      dateOfBirth: "1990-01-01",
      coursesTaught: [],
    });

    const instructorToken = generateToken({ id: instructor._id, role: "instructor" });

    const courseData = {
      courseName: "Introduction to Testing",
      courseCode: "IT101",
      courseDescription: "Learn the basics of software testing",
      credits: 3,
      courseDuration: "12 weeks",
      department: "Computer Science",
      semester: 1,
    };

    const response = await request(app)
      .post(PATH) // Replace with your actual endpoint
      .set("Authorization", `Bearer ${instructorToken}`) // Use the generated token
      .send(courseData)
      .expect(201);

    expect(response.body.status).toBe("success");
    expect(response.body.data.course).toMatchObject({
      courseName: "Introduction to Testing",
      courseCode: "IT101",
      department: "Computer Science",
    });

    // Verify the course is in the database
    const courseInDb = await Course.findOne({ courseCode: "IT101" });
    expect(courseInDb).not.toBeNull();
    expect(courseInDb.courseName).toBe("Introduction to Testing");

    // Verify the course is added to the instructor's coursesTaught
    const updatedInstructor = await Instructor.findById(instructor._id);
    expect(updatedInstructor.coursesTaught).toContainEqual(courseInDb._id);
  });

  it("should return 401 if no token is provided", async () => {
    const courseData = {
      courseName: "Introduction to Testing",
      courseCode: "IT101",
      courseDescription: "Learn the basics of software testing",
      credits: 3,
      courseDuration: "12 weeks",
      department: "Computer Science",
      semester: 1,
    };

    const response = await request(app).post(PATH).send(courseData).expect(401);

    expect(response.body.message).toBe("you are not logged in");
  });

  it("should return 401 if the user is not an instructor", async () => {
    const studentToken = generateToken({ id: "student123", role: "student" });

    const courseData = {
      courseName: "Introduction to Testing",
      courseCode: "IT101",
      courseDescription: "Learn the basics of software testing",
      credits: 3,
      courseDuration: "12 weeks",
      department: "Computer Science",
      semester: 1,
    };

    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${studentToken}`)
      .send(courseData)
      .expect(401);

    expect(response.body.message).toBe("Not authorized as an instructor");
  });

  it("should return 400 if required fields are missing", async () => {
    const instructorToken = generateToken({ id: "instructor123", role: "instructor" });

    const incompleteData = {
      courseName: "Introduction to Testing",
      courseCode: "IT101",
    };

    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send(incompleteData)
      .expect(400);

    expect(response.body.message).toBe("Please provide all required fields");
  });

  it("should return 400 if a course with the same code already exists", async () => {
    // Generate a valid ObjectId for instructorId
    const instructorId = new mongoose.Types.ObjectId();
    // Generate a token with the ObjectId as id
    const instructorToken = generateToken({ id: instructorId.toString(), role: "instructor" });

    const courseData = {
      courseName: "Introduction to Testing",
      courseCode: "IT101",
      courseDescription: "Learn the basics of software testing",
      credits: 3,
      courseDuration: "12 weeks",
      department: "Computer Science",
      semester: 1,
    };

    // Add a course to the database
    await Course.create({
      ...courseData,
      courseCode: courseData.courseCode.toUpperCase(),
      instructorId,
    });

    // Try to add another course with the same code
    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send(courseData)
      .expect(400);

    expect(response.body.message).toBe("Course already exists");
  });
});
