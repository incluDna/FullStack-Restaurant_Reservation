const express = require("express");
const {
  getQueues,
  getIncompleteQueues,
  getQueuePosition,
  createQueue,
  updateQueueStatus,
  deleteQueue,
  pollQueueState,
  pollIncompleteQueues,
} = require("../controllers/queues");

const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

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
 *         id:
 *           type: string
 *           description: Auto-generated queue ID
 *         restaurant:
 *           type: string
 *           description: Restaurant ID this queue belongs to
 *         user:
 *           type: string
 *           description: User ID who created the queue
 *         seatCount:
 *           type: integer
 *           description: Number of seats requested
 *         queueStatus:
 *           type: string
 *           enum: [waiting, seated, cancelled]
 *           description: Status of the queue
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 66123abc456def7890ghi
 *         restaurant: 660abc1234def56789abcdef
 *         user: 660abc1234def56789aaaaaa
 *         seatCount: 4
 *         queueStatus: waiting
 *         createdAt: "2024-04-28T09:00:00.000Z"
 *         updatedAt: "2024-04-28T09:10:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Queues
 *   description: The queue management API
 */

/**
 * @swagger
 * /queues:
 *   get:
 *     summary: Get queues for the current user or a restaurant (user)
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of queues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Queue'
 *     x-roles:
 *       - user
 */

/**
 * @swagger
 * /restaurants/{restaurantId}/queues:
 *   post:
 *     summary: Create a new queue for a restaurant
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Queue'
 *     responses:
 *       201:
 *         description: Queue created successfully
 */

router.route("/").get(protect, getQueues).post(protect, authorize("user"), createQueue);

/**
 * @swagger
 * /restaurants/{restaurantId}/queues/incomplete:
 *   get:
 *     summary: Get all incomplete queues for a restaurant (admin/employee only)
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: List of incomplete queues
 */
router
  .route("/incomplete")
  .get(protect, authorize("admin", "employee"), getIncompleteQueues);

/**
 * @swagger
 * /restaurants/{restaurantId}/queues/{id}/position:
 *   get:
 *     summary: Get a queue's position in a restaurant
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Queue ID
 *     responses:
 *       200:
 *         description: Queue position information
 */

router
  .route("/:id")
  .put(protect, authorize("admin", "employee"), updateQueueStatus)
  .delete(protect, deleteQueue);

router
  .route("/:id/position")
  .get(protect, getQueuePosition);

/**
 * @swagger
 * /queues/{id}:
 *   put:
 *     summary: Update a queue status (admin/employee only)
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Queue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Queue'
 *     responses:
 *       200:
 *         description: Queue updated successfully
 *   delete:
 *     summary: Delete a queue
 *     tags: [Queues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Queue ID
 *     responses:
 *       204:
 *         description: Queue deleted successfully
 */

router.route("/incomplete/long-poll").get(protect, pollIncompleteQueues);
router.route("/:id/long-poll").get(protect, pollQueueState);

module.exports = router;
