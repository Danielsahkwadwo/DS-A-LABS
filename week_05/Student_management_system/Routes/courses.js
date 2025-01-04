const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseDetails,
  updateCourse,
  deleteCourse,
  sortCourses,
} = require("../Controllers/courses");
const { isAuthorized, isInstructor } = require("../Middlewares/authMiddleware");
const cacheMiddleware = require("../Middlewares/cacheMiddleware");
const router = express.Router();

router.use(isAuthorized);

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Bad request
 */
router.post("/", isInstructor, createCourse);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Successfully retrieved all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.get("/", cacheMiddleware("courses", 1800), getCourses);

/**
 * @swagger
 * /api/v1/courses/{courseCode}:
 *   get:
 *     summary: Get a course by courseCode
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The courseCode of the course
 *     responses:
 *       200:
 *         description: Successfully retrieved the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get("/:courseCode", getCourseDetails);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Successfully updated the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

router.put("/:courseCode", isInstructor, updateCourse);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Successfully deleted the course
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.delete("/:courseCode", isInstructor, deleteCourse);

/**
 * @swagger
 * /api/v1/courses/sort/courses?sortBy=courseCode&order=asc:
 *   get:
 *     summary: Sort courses by a provided criteria
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: criteria
 *         schema:
 *           type: string
 *         required: true
 *         description: The criteria to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: The order to sort in
 *     responses:
 *       200:
 *         description: Successfully retrieved all courses sorted by courseCode
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get("/sort/courses", isAuthorized, isInstructor, cacheMiddleware("courses", 1800), sortCourses);

module.exports = router;
