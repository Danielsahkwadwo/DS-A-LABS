const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Student = require("../../Models/students");
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
let PATH = "/api/v1/students";

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
});

// Test the addStudent endpoint
describe("POST /students - addStudent", () => {
  it("should create a student and return 201 status", async () => {
    // Generate a mock token
    const instructorToken = generateToken({ id: "instructor123", role: "instructor" });
    //mock student data
    const studentData = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      gender: "male",
      studentId: "student123",
      department: "Computer Science",
      password: "password123",
    };

    // Make the request
    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${instructorToken}`) // Use the generated token
      .send(studentData)
      .expect(201);
    //       run assertions
    expect(response.body.status).toBe("success");
    expect(response.body.data.student).toMatchObject({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      studentId: "student123",
    });

    // Verify the student is in the database
    const studentInDb = await Student.findOne({ studentId: "student123" });
    expect(studentInDb).not.toBeNull();
    expect(studentInDb.email).toBe("john.doe@example.com");
  });

  // Test cases
  it("should return 401 if no token is provided", async () => {
    // Mock student data
    const studentData = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      gender: "male",
      studentId: "student123",
    };
    // make the request
    const response = await request(app).post(PATH).send(studentData).expect(401);
    //       run assertions
    expect(response.body.message).toBe("you are not logged in");
  });

  // Test cases
  it("should return 401 if the user is not an instructor", async () => {
    // Generate a mock token
    const studentToken = generateToken({ id: "student123", role: "student" });
    //mock student data
    const studentData = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      gender: "male",
      studentId: "student123",
    };
    // make the request
    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${studentToken}`) // Token for a non-instructor
      .send(studentData)
      .expect(401);
    //       run assertions
    expect(response.body.message).toBe("Not authorized as an instructor");
  });

  // Test cases
  it("should return 400 if required fields are missing", async () => {
    const instructorToken = generateToken({ id: "instructor123", role: "instructor" });
    // Mock student data
    const incompleteData = {
      firstName: "John",
      lastName: "Doe",
    };
    // make the request
    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send(incompleteData)
      .expect(400);
    //       run assertions
    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("All fields are required");
  });

  // Test cases
  it("should return 400 if email or student ID already exists", async () => {
    const instructorToken = generateToken({ id: "instructor123", role: "instructor" });
    // Mock student data
    const studentData = {
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "jane.doe@example.com",
      phoneNumber: "0987654321",
      gender: "female",
      studentId: "student456",
      department: "Computer Science",
      password: "password123",
    };

    // Add a student to the database
    await Student.create(studentData);

    // Try to add another student with the same email
    const response = await request(app)
      .post(PATH)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({ ...studentData, phoneNumber: "5555555555" }) // Change phoneNumber but keep email and studentId same
      .expect(400);

    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Email or student ID already exists");
  });
});

// Test the getStudents endpoint
describe("GET /students - getStudents", () => {
  test("should return all students with pagination and filtering applied", async () => {
    const instructorToken = generateToken({ id: "instructor123", role: "instructor" });
    // Seed test data
    await Student.create([
      {
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        password: "password1",
        dateOfBirth: "2000-01-01",
        department: "Computer Science",
        studentId: "STUDENT001",
        gender: "female",
        phoneNumber: "1234567890",
      },
      {
        firstName: "Bob",
        lastName: "Doe",
        email: "bob@example.com",
        password: "password2",
        dateOfBirth: "2000-01-01",
        department: "Computer Science",
        studentId: "STUDENT002",
        gender: "male",
        phoneNumber: "1234567890",
      },
      {
        firstName: "Charlie",
        lastName: "Brown",
        email: "charlie@example.com",
        password: "password3",
        dateOfBirth: "2000-01-01",
        department: "Computer Science",
        studentId: "STUDENT003",
        gender: "female",
        phoneNumber: "1234567890",
      },
    ]);

    const response = await request(app)
      .get(`${PATH}?firstName=Bob&page=1&limit=1`) // Query for filtering and pagination
      .set("Authorization", `Bearer ${instructorToken}`); // Use the generated token

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.results).toBe(1); // Pagination limit is 1
    expect(response.body.data.students[0].firstName).toBe("Bob"); // Only one student should match
    expect(response.body.data.students[0].password).toBeUndefined(); // Ensure password is excluded
  });

  test("should return empty array if no students match the query", async () => {
    const instructorToken = generateToken({ id: "instructor123", role: "instructor" });

    const response = await request(app)
      .get(`${PATH}?age[gte]=30`) // Query with no matching data
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.students).toStrictEqual([]);
  });

  test("should return 401 if no authorization token is provided", async () => {
    const response = await request(app).get(PATH);

    expect(response.status).toBe(401); // Adjust based on your middleware
    expect(response.body.message).toBe("you are not logged in"); // Customize this message as needed
  });
});
