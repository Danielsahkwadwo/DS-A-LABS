const express = require("express");
const {
  createEnrollment,
  getStudentEnrollments,
  selfEnrollment,
  deleteEnrollmentByStudent,
  getEnrollments,
  deleteEnrollmentByInstructor,
  getStudentEnrolledInCourse,
} = require("../Controllers/enrolment");
const { protected, isInstructor } = require("../Middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Enrolments
 *   description: API for managing enrolments between students and courses
 */

/**
 * @swagger
 * /api/v1/enrolments:
 *   get:
 *     summary: Get all enrolments
 *     tags: [Enrolments]
 *     responses:
 *       200:
 *         description: Successfully retrieved all enrolments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrolment'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/", protected, isInstructor, getEnrollments);
/**
 * @swagger
 * /api/v1/enrolments:
 *   post:
 *     summary: enrol a student in a course (permitted by instructor)
 *     tags: [Enrolments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrolment'
 *     responses:
 *       200:
 *         description: Successfully created an enrolment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrolment'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/", protected, isInstructor, createEnrollment);

/**
 * @swagger
 * /api/v1/enrolments/enroll-self:
 *   post:
 *     summary: Enroll a student in a course (permitted by student)
 *     tags: [Enrolments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrolment'
 *     responses:
 *       200:
 *         description: Successfully enrolled the student in the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrolment'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/enroll-self", protected, selfEnrollment);

/**
 * @swagger
 * /api/v1/enrolments/student/{studentId}:
 *   get:
 *     summary: Get all enrolments for a student
 *     tags: [Enrolments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Successfully retrieved all enrolments for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrolment'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/student/:studentId", protected, getStudentEnrollments);

/**
 * @swagger
 * /api/v1/enrolments/course/{courseCode}:
 *   get:
 *     summary: Get all enrolments for a course (permitted by instructor)
 *     tags: [Enrolments]
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The code of the course
 *     responses:
 *       200:
 *         description: Successfully retrieved all enrolments for the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrolment'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get(
  "/course/:courseCode",
  protected,
  isInstructor,
  getStudentEnrolledInCourse
);

/**
 * @swagger
 * /api/v1/enrolments/delete/{enrollmentId}:
 *   delete:
 *     summary: Delete an enrolment
 *     tags: [Enrolments]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the enrolment
 *     responses:
 *       200:
 *         description: Successfully deleted the enrolment
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:enrollmentId", protected, deleteEnrollmentByStudent);

/**
 * @swagger
 * /api/v1/enrolments/{enrollmentId}:
 *   delete:
 *     summary: Delete an enrolment (permitted by instructor)
 *     tags: [Enrolments]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the enrolment
 *     responses:
 *       200:
 *         description: Successfully deleted the enrolment
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.delete("/:enrollmentId", protected, deleteEnrollmentByInstructor);
module.exports = router;
