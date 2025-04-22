const Restaurant = require("../models/Restaurant");
const Reservation = require("../models/Reservation");
const Review = require("../models/Review");
const Queue = require("../models/Queue");
const asyncHandler = require("../utils/asyncHandler");
const APIFeatures = require("../utils/APIFeatures");
const { toMinutes } = require("../utils/parseTimes");

/**
 * @description Get all restaurants
 * @route GET /api/restaurants
 * @access Public
 */
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Restaurant.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const restaurants = await features.query;
  const total = await Restaurant.countDocuments(features.query.getFilter());

  const [totalPages, pagination] = features.getPaginationMetadata(total);
  res.status(200).json({
    success: true,
    count: restaurants.length,
    totalPages,
    data: restaurants,
    pagination,
  });
});

/**
 * @description Get single restaurant
 * @route GET /api/restaurants/:id
 * @access Public
 */
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    const error = new Error(`No restaurant with the id of ${req.params.id}`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

/**
 * @description Create a restaurant
 * @route POST /api/restaurants
 * @access Private
 */
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  let openMinutes, closeMinutes;
  try {
    openMinutes = toMinutes(req.body.openTime);
    closeMinutes = toMinutes(req.body.closeTime);
  } catch (error) {
    throw error;
  }
  if (openMinutes >= closeMinutes) {
    const error = new Error(
      "Opening time must be before closing time in the same day"
    );
    error.statusCode = 400;
    throw error;
  }

  const restaurant = await Restaurant.create(req.body);

  res.status(201).json({
    success: true,
    data: restaurant,
  });
});

/**
 * @description Update a restaurant
 * @route PUT /api/restaurants/:id
 * @access Private
 */
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!restaurant) {
    const error = new Error(`No restaurant with the id of ${req.params.id}`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

/**
 * @description Delete a restaurant
 * @route DELETE /api/restaurants/:id
 * @access Private
 */
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    const error = new Error(`No restaurant with the id of ${req.params.id}`);
    error.statusCode = 404;
    throw error;
  }

  // Delete all reservations, reviews, and queues associated with the restaurant
  await Promise.all([
    Reservation.deleteMany({ restaurant: req.params.id }),
    Review.deleteMany({ restaurant: req.params.id }),
    Queue.deleteMany({ restaurant: req.params.id }),
  ]);
  await Restaurant.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});
