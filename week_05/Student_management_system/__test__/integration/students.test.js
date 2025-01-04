const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../server");
const Student = require("../../Models/students");


let server;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  server = app.listen(4000);
});

afterAll(async () => {
  await server.close();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Student.deleteMany();
});

describe("POST /students - addStudent", () => {
  it("should create a student and return 201 status", async () => {
    const studentData = {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "john.doe@example.com",
      phoneNumber: "1234567890",
      gender: "male",
      studentId: "student123",
    };

    const response = await request(app)
      .post("/api/v1/students") // Replace with your actual endpoint
      .send(studentData)
      .expect(201);

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

  it("should return 400 if required fields are missing", async () => {
    const incompleteData = {
      firstName: "John",
      lastName: "Doe",
    };

    const response = await request(app).post("/students").send(incompleteData).expect(400);

    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("All fields are required");
  });

  it("should return 400 if email or student ID already exists", async () => {
    const studentData = {
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "2000-01-01",
      email: "jane.doe@example.com",
      phoneNumber: "0987654321",
      gender: "female",
      studentId: "student456",
    };

    // Add a student to the database
    await Student.create(studentData);

    // Try to add another student with the same email
    const response = await request(app)
      .post("/students")
      .send({ ...studentData, phoneNumber: "5555555555" }) // Change phoneNumber but keep email and studentId same
      .expect(400);

    expect(response.body.status).toBe("fail");
    expect(response.body.message).toBe("Email or student ID already exists");
  });
});
