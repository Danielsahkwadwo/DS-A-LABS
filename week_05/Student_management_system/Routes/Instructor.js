const express = require("express");
const router = express.Router();
const { isAuthorized, isInstructor } = require("../Middlewares/authMiddleware");
const {
  addInstructor,
  getAllInstructors,
  getInstructor,
  updateInstructor,
  deleteInstructor,
  loginInstructor,
} = require("../Controllers/Instructor");

/**
 * @swagger
 * tags:
 *   name: Instructors
 *   description: API for managing instructors
 */

/**
 * @swagger
 * /api/v1/instructors/auth/login:
 *   post:
 *     summary: Login an instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: Successfully logged in the instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/auth/login", loginInstructor);

router.use(isAuthorized, isInstructor);
/**
 * @swagger
 * /api/v1/instructors:
 *   post:
 *     summary: Create a new instructor
 *     tags: [Instructors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: Successfully created the instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/", addInstructor);

/**
 * @swagger
 * /api/v1/instructors:
 *   get:
 *     summary: Get all instructors
 *     tags: [Instructors]
 *     responses:
 *       200:
 *         description: Successfully retrieved all instructors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instructor'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Internal server error
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllInstructors);

/**
 * @swagger
 * /api/v1/instructors/{id}:
 *   get:
 *     summary: Get an instructor by ID
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the instructor
 *     responses:
 *       200:
 *         description: Successfully retrieved the instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getInstructor);

/**
 * @swagger
 * /api/v1/instructors/{id}:
 *   put:
 *     summary: Update an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the instructor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instructor'
 *     responses:
 *       200:
 *         description: Successfully updated the instructor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instructor'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateInstructor);

/**
 * @swagger
 * /api/v1/instructors/{id}:
 *   delete:
 *     summary: Delete an instructor
 *     tags: [Instructors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the instructor
 *     responses:
 *       200:
 *         description: Successfully deleted the instructor
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteInstructor);

module.exports = router;
