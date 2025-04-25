const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");
const APIError = require("../utils/APIError");
const APIFeatures = require("../utils/APIFeatures");
const asyncHandler = require("../utils/asyncHandler");
const { isValidObjectId } = require("mongoose");

const restaurantPopulate = {
  path: "restaurant",
  select: "name province shortLocation tel",
};
const userPopulate = {
  path: "user",
  select: "name tel",
};

/**
 * @description Get all reviews
 * @route GET /api/reviews | /api/restaurants/:restaurantId/reviews
 * @access Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  let baseQuery;

  if (req.params.restaurantId) {
    if (!isValidObjectId(req.params.restaurantId)) {
      throw new APIError("Invalid Object ID", 400);
    }
    baseQuery = Review.find({ restaurant: req.params.restaurantId });
  } else if (req.user && req.user.role === "user") {
    baseQuery = Review.find({ user: req.user.id });
  } else if (req.user && req.user.role == "admin") {
    baseQuery = Review.find();
  } else {
    throw new APIError("Not authorized to access this resource", 403);
  }

  const features = new APIFeatures(baseQuery, req.query).filter().sort().limitFields();

  const reviews = await features.query.populate(restaurantPopulate).populate(userPopulate);

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @description Get single review
 * @route GET /api/reviews/:id | /api/restaurants/:restaurantId/reviews/:id
 * @access Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate(restaurantPopulate)
    .populate(userPopulate);

  if (!review) {
    throw new APIError(`No review with the id of ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @description Create a review
 * @route POST /api/reviews/:id | /api/restaurants/:restaurantId/reviews/:id
 * @access Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.restaurantId)) {
    throw new APIError("Invalid restaurant id: not an ObjectID", 400);
  }
  req.body.restaurant = req.params.restaurantId;

  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    throw new APIError(`No restaurant with the id of ${req.params.restaurantId}`, 404);
  }

  req.body.user = req.user.id;

  const existingReview = await Review.find({
    user: req.user.id,
    restaurant: req.params.restaurantId,
  });

  if (existingReview.length > 0) {
    throw new APIError("This user has already reviewed", 400);
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review,
  });
});

/**
 * @description Update a review
 * @route PUT /api/reviews/:id | /api/restaurants/:restaurantId/reviews/:id
 * @access Private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    throw new APIError(`No review with the id of ${req.params.id}`, 404);
  }
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new APIError(`User ${req.user.id} is not authorized to update this review`, 403);
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @description Delete a review
 * @route DELETE /api/reviews/:id | /api/restaurants/:restaurantId/reviews/:id
 * @access Private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    throw new APIError(`No review with the id of ${req.params.id}`, 404);
  }
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new APIError(`User ${req.user.id} is not authorized to delete this review`, 403);
  }

  await review.deleteOne();

  res.status(204).json({
    success: true,
    data: {},
  });
});

/**
 * @description Get reviews for a restaurant
 * @route GET /api/reviews/means/:id
 * @access Public
 */
exports.getAverageReviewForRestaurant = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    throw new APIError("Invalid restaurant id: not an ObjectID", 400);
  }

  // Find all reviews for the given restaurant ID
  const reviews = await Review.find({ restaurant: req.params.id });

  const totalRating = reviews.reduce((sum, review) => sum + review.reviewStar, 0);
  const meanRating = totalRating / reviews.length;

  const restaurant = await Restaurant.findById(req.params.id);
  res.status(200).json({
    success: true,
    name: restaurant.name,
    totalRating: meanRating.toFixed(2),
    count: reviews.length,
  });
});
