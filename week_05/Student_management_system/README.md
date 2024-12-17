# **Student Management System**

## **Overview**

The **Student Management System** is designed to manage student data, courses, and instructors. This system allows for easy management of student information, course enrollment, and instructor assignments.

---

## **Features**

### 🧑‍🎓 **Student Management**

- Create, read, update, and delete student records.
- Manage student personal details, contact information, and academic history.

### 📚 **Course Management**

- Create, read, update, and delete course records.
- Manage course details, including course code, name, description, credits, and duration.

### 👨‍🏫 **Instructor Management**

- Create, read, update, and delete instructor records.
- Manage instructor personal details, contact information, and course assignments.

### 📝 **Enrollment Management**

- Enroll students in courses.
- Manage course enrollment, including adding and removing students from courses.

---

## **Models**

The system uses the following models to manage data:

1. **Student**: Represents a student, with attributes for personal details, contact information, and academic history.
2. **Course**: Represents a course, with attributes for course code, name, description, credits, and duration.
3. **Instructor**: Represents an instructor, with attributes for personal details, contact information, and course assignments.

---

## **API Endpoints**

### 📌 **Student Endpoints**

| **Method** | **Endpoint**    | **Description**                 |
| ---------- | --------------- | ------------------------------- |
| `GET`      | `/students`     | Retrieve a list of all students |
| `GET`      | `/students/:id` | Retrieve a single student by ID |
| `POST`     | `/students`     | Create a new student record     |
| `PUT`      | `/students/:id` | Update a student record         |
| `DELETE`   | `/students/:id` | Delete a student record         |

### 📌 **Course Endpoints**

| **Method** | **Endpoint**   | **Description**                |
| ---------- | -------------- | ------------------------------ |
| `GET`      | `/courses`     | Retrieve a list of all courses |
| `GET`      | `/courses/:id` | Retrieve a single course by ID |
| `POST`     | `/courses`     | Create a new course record     |
| `PUT`      | `/courses/:id` | Update a course record         |
| `DELETE`   | `/courses/:id` | Delete a course record         |

### 📌 **Instructor Endpoints**

| **Method** | **Endpoint**       | **Description**                    |
| ---------- | ------------------ | ---------------------------------- |
| `GET`      | `/instructors`     | Retrieve a list of all instructors |
| `GET`      | `/instructors/:id` | Retrieve a single instructor by ID |
| `POST`     | `/instructors`     | Create a new instructor record     |
| `PUT`      | `/instructors/:id` | Update an instructor record        |
| `DELETE`   | `/instructors/:id` | Delete an instructor record        |

### 📌 **Enrolment Endpoints**

| **Method** | **Endpoint**       | **Description**                    |
| ---------- | ------------------ | ---------------------------------- |
| `GET`      | `/enrollments/course/{courseCode}`     | Retrieve all students enrolled in a course |
| `GET`      | `/enrollments/student/{studentId}` | Retrieve all courses for a student |
| `POST`     | `/enrollments`     | Enroll student in a course          |
| `DELETE`   | `/enrollments/:id` | Delete an enrollments record        |

---

## **Installation**

To install the system, follow these steps:

1. **Clone the repository**:

2. **Update your environment variables in the env_example.env file**:

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the server**:

   ```bash
   npm start
   ```

---

## **Usage**

To use the system:

1. Open a web browser and navigate to the link below for a swagger documentation of the project:

   ```
   http://localhost:8000/api-docs/
   ```

2. Use the API endpoints to manage student, course, and instructor data.
