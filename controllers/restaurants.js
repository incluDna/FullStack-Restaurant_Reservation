const Restaurant = require("../models/Restaurant");
const Reservation = require("../models/Reservation");
const Review = require("../models/Review");
const Queue = require("../models/Queue");
const Menu = require("../models/Menu");
const asyncHandler = require("../utils/asyncHandler");
const APIFeatures = require("../utils/APIFeatures");
const APIError = require("../utils/APIError");
const { toMinutes } = require("../utils/parseTimes");

/**
 * @description Get ALL restaurants. Supports filtering, sorting, selecting fields, and pagination.
 * @route GET /api/restaurants
 * @access Public
 */
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const features = new APIFeatures(Restaurant.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const restaurants = await features.query.lean();

  const data = await appendAverageReview(restaurants);
  
  const total = await Restaurant.countDocuments(features.query.getFilter());
  const [totalPages, pagination] = features.getPaginationMetadata(total);
  
  res.status(200).json({
    success: true,
    count: data.length,
    totalPages,
    data: data,
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
    throw new APIError("Restaurant not found", 404);
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
    throw new APIError("Opening time must be before closing time in the same day", 400);
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
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!restaurant) {
    throw new APIError("Restaurant not found", 404);
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
    throw new APIError("Restaurant not found", 404);
  }

  // Delete all reservations, reviews, and queues associated with the restaurant
  await Promise.all([
    Reservation.deleteMany({ restaurant: req.params.id }),
    Review.deleteMany({ restaurant: req.params.id }),
    Queue.deleteMany({ restaurant: req.params.id }),
    Menu.deleteMany({ restaurant: req.params.id }),
  ]);
  await Restaurant.deleteOne({ _id: req.params.id });

  res.status(204).json({
    success: true,
    data: {},
  });
});

async function appendAverageReview(restaurants) {
  const ratingStats = await Review.aggregate([
    { $match: { restaurant: { $in: restaurants.map((r) => r._id) } } },
    {
      $group: {
        _id: "$restaurant",
        avgRating: { $avg: "$reviewStar" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const statsMap = ratingStats.reduce((map, s) => {
    map[s._id.toString()] = {
      avgRating: Number(s.avgRating.toFixed(2)),
      reviewCount: s.reviewCount,
    };
    return map;
  }, {});

  const data = restaurants.map((r) => {
    const stat = statsMap[r._id.toString()] || { avgRating: 0, reviewCount: 0 };
    return { ...r, ...stat };
  });

  return data;
}
