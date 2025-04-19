const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  getReviewsForRestaurant,
} = require("../controllers/reviews");

const router = express.Router({ mergeParams: true });

const { protect, authorize, optionalAuth } = require("../middleware/auth");

router
  .route("/")
  .get(optionalAuth, getReviews)
  .post(protect, authorize("admin", "user"), addReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("admin", "user"), updateReview)
  .delete(protect, authorize("admin", "user"), deleteReview);
router.route("/means/:id").get(getReviewsForRestaurant);

module.exports = router;
