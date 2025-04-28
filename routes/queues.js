const express = require("express");
const {
  getQueues,
  getIncompleteQueues,
  getQueuePosition,
  createQueue,
  updateQueueStatus,
  deleteQueue,
} = require("../controllers/queues");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Queue:
 *       type: object
 *       required:
 *         - restaurant
 *         - user
 *         - seatCount
 *         - queueStatus
 *       properties:
 *         restaurant:
 *           type: string
 *         user:
 *           type: string
 *         seatCount:
 *           type: number
 *         queueStatus:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Queues
 *   description: Queue management
 */

/**
 * @swagger
 * /queues:
 *   get:
 *     summary: Get queues for user
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's queues.
 *   post:
 *     summary: Create a new queue
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Queue'
 *     responses:
 *       201:
 *         description: Queue created successfully.
 */
router
  .route("/")
  .get(protect, authorize("user"), getQueues)
  .post(protect, authorize("user"), createQueue);

/**
 * @swagger
 * /queues/all:
 *   get:
 *     summary: Get queues for admin and employee
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incomplete queues.
 */
router
  .route("/all")
  .get(protect, authorize("admin", "employee"), getIncompleteQueues);

/**
 * @swagger
 * /queues/{id}/position:
 *   get:
 *     summary: Get a queue's position
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Queue ID
 *     responses:
 *       200:
 *         description: Information about the queue position.
 */
router
  .route("/:id/position")
  .get(protect, getQueuePosition);

/**
 * @swagger
 * /queues/{id}:
 *   put:
 *     summary: Update queue status (admin/employee only)
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Queue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Queue'
 *     responses:
 *       200:
 *         description: Queue updated successfully.
 *   delete:
 *     summary: Delete a queue (user or employee)
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Queue ID
 *     responses:
 *       204:
 *         description: Queue deleted successfully.
 */
router
  .route("/:id")
  .put(protect, authorize("admin", "employee"), updateQueueStatus)
  .delete(protect, authorize("user", "employee"), deleteQueue);

module.exports = router;
