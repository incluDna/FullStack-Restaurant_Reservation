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
 * /queue:
 *   get:
 *     summary: Get queues for user
 *     tags: [Queues]
 *     responses:
 *       200:
 *         description: List of the user's queues.
 *   post:
 *     summary: Create a new queue
 *     tags: [Queues]
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
 * /queue/all:
 *   get:
 *     summary: Get queues for admin and employee
 *     tags: [Queues]
 *     responses:
 *       200:
 *         description: List of incomplete queues.
 */
router
  .route("/all")
  .get(protect, authorize("admin", "employee"), getIncompleteQueues);

/**
 * @swagger
 * /queue/{id}/position:
 *   get:
 *     summary: Get a queue's position
 *     tags: [Queues]
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
 * /queue/{id}:
 *   put:
 *     summary: Update queue status (admin/employee only)
 *     tags: [Queues]
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
