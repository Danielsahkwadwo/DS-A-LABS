const express = require("express");
const {
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  loginStudent,
  sortStudents,
  forgotPassword,
  passwordReset,
  getSelf,
  updateSelf,
} = require("../Controllers/students");
const { protected, isInstructor } = require("../Middlewares/authMiddleware");
const cacheMiddleware = require("../Middlewares/cacheMiddleware");
const router = express.Router();

/***
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing students
 */

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post("/", protected, isInstructor, addStudent);

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Successfully retrieved all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Internal server error
 */
router.get("/", protected, isInstructor, getStudents);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Successfully retrieved the student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 */
router.get("/get-student/:id", protected, isInstructor, getStudent);

/**
 * @swagger
 * /api/v1/students/get-self:
 *   get:
 *     summary: Get the current student
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Successfully retrieved the current student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student not found
 */
router.get("/get-self", protected, getSelf);
/**
 * @swagger
 * /api/v1/students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Successfully updated the student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 */
router.put("/update/:id", protected, isInstructor, updateStudent);

/**
 * @swagger
 * /api/v1/students/update-self:
 *   put:
 *     summary: Update the current student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Successfully updated the current student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       401:
 *         description: Unauthorized
 */
router.put("/update-self", protected, updateSelf);
/**
 * @swagger
 * /api/v1/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student
 *     responses:
 *       204:
 *         description: Successfully deleted the student
 *       404:
 *         description: Student not found
 */
router.delete("/:id", protected, isInstructor, deleteStudent);

/**
 * @swagger
 * /api/v1/students/auth/login:
 *   post:
 *     summary: Login a student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentLogin'
 *     responses:
 *       200:
 *         description: Successfully logged in the student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentLogin'
 *       401:
 *         description: Invalid email or password
 */
router.post("/auth/login", loginStudent);

/**
 * @swagger
 * /api/v1/students/sort/students?sortBy=name&order=asc:
 *   get:
 *     summary: Sort students by a provided criteria
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         required: true
 *         description: The criteria to sort students by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: The order to sort students in
 *     responses:
 *       200:
 *         description: Successfully retrieved all students sorted by name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Internal server error
 */
router.get("/sort/students", protected, isInstructor, cacheMiddleware("students", 1800), sortStudents);

/**
 * @swagger
 * /api/v1/students/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPassword'
 *     responses:
 *       200:
 *         description: Successfully sent the password reset link
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForgotPassword'
 *       404:
 *         description: Student not found
 */
router.post("/auth/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/v1/students/auth/password-reset/{email}/{token}:
 *   get:
 *     summary: Password reset
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Successfully reset the password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PasswordReset'
 *       404:
 *         description: Student not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/auth/password-reset/:email/:token", passwordReset);

module.exports = router;
