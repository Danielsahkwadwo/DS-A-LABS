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
} = require("../Controllers/students");
const { protected, isInstructor } = require("../Middlewares/authMiddleware");
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
router.get("/:id", protected, getStudent);

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
router.put("/:id", protected, updateStudent);

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
 * /api/v1/students/sort/students?sortBy=name:asc:
 *   get:
 *     summary: Sort students by a provided criteria
 *     tags: [Students]
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
router.get("/sort/students", protected, isInstructor, sortStudents);

router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/password-reset/:email/:token", passwordReset);

module.exports = router;
