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

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getQueues).post(protect, authorize("user"), createQueue);
router.route("/incomplete").get(protect, getIncompleteQueues);
router.route("/incomplete/long-poll").get(protect, pollIncompleteQueues);

router
  .route("/:id")
  .put(protect, authorize("admin", "employee"), updateQueueStatus)
  .delete(protect, deleteQueue);

router.route("/:id/position").get(protect, getQueuePosition);
router.route("/:id/long-poll").get(protect, pollQueueState);

module.exports = router;
