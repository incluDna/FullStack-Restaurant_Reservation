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

router.route("/").get(protect, getQueues).post(protect, authorize("user"), createQueue);
router.route("/incomplete").get(protect, getIncompleteQueues);

router
  .route("/:id")
  .put(protect, authorize("admin", "employee"), updateQueueStatus)
  .delete(protect, deleteQueue);

router.route("/:id/position").get(protect, getQueuePosition);

module.exports = router;
