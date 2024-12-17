const express = require("express");
const {
  createEnrollment,
  deleteEnrollment,
  getStudentEnrollments,
} = require("../Controllers/enrolment");
const { protected } = require("../Middlewares/authMiddleware");
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
 *   post:
 *     summary: Create an enrolment
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
router.post("/", protected, createEnrollment);

/**
 * @swagger
 * /api/v1/enrolments/{studentId}:
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

router.get("/course/:courseCode");

/**
 * @swagger
 * /api/v1/enrolments/{enrollmentId}:
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
router.delete("/:enrollmentId", protected, deleteEnrollment);
module.exports = router;
