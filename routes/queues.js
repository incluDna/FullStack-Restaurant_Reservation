const express = require("express");
const {
  getQueues,
  createQueue,
  updateQueueStatus,
  deleteQueue,
} = require("../controllers/queues");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(protect, getQueues).post(protect, createQueue);
router
  .route("/:id")
  .put(protect, authorize("admin", "employee"), updateQueueStatus)
  .delete(protect, deleteQueue);

module.exports = router;

