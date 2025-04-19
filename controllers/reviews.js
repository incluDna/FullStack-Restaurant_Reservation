const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");
const Reservation = require("../models/Reservation");

/**
 * @description Get all reviews
 * @route GET /api/reviews
 * @access Public
 */
exports.getReviews = async (req, res, next) => {
  let query;

  // Check if the user is authenticated (req.user exists)
  if (req.user) {
    // If the user is authenticated, they can see reviews based on their role
    if (req.user.role !== "admin") {
      // General users can only see their own reviews or reviews for a specific restaurant
      if (req.params.restaurantId) {
        query = Review.find({ restaurant: req.params.restaurantId }).populate({
          path: "restaurant",
          select: "name",
        });
      } else {
        query = Review.find({ user: req.user.id }).populate({
          path: "restaurant",
          select: "name reviews",
        });
      }
    } else {
      // Admin users can view all reviews or reviews for a specific restaurant
      if (req.params.restaurantId) {
        query = Review.find({ restaurant: req.params.restaurantId }).populate({
          path: "restaurant",
          select: "name",
        });
      } else {
        query = Review.find().populate({
          path: "restaurant",
          select: "name",
        });
      }
    }
  } else {
    // If the user is not logged in (guest user), allow them to see reviews for a specific restaurant
    if (req.params.restaurantId) {
      query = Review.find({ restaurant: req.params.restaurantId }).populate({
        path: "restaurant",
        select: "name",
      });
    } else {
      // Allow guest users to see all reviews if no specific restaurant is provided
      query = Review.find().populate({
        path: "restaurant",
        select: "name",
      });
    }
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await Review.countDocuments(query.getQuery());
    const totalPages = Math.ceil(total / limit);
    query = query.skip(startIndex).limit(limit);

    const reviews = await query;

    const pagination = {};
    // next
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    // previous
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Review",
    });
  }
};

/**
 * @description Get single review
 * @route GET /api/reviews/:id
 * @access Public
 */
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: "restaurant",
      select: "name reviews",
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No review with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Review",
    });
  }
};
/**
 * @description Create a review
 * @route POST /api/reviews/:id
 * @access Private
 */
exports.addReview = async (req, res, next) => {
  try {
    req.body.restaurant = req.params.restaurantId;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `No restaurant with the id of ${req.params.restaurantId}`,
      });
    }
    // Add user ID to req.body
    req.body.user = req.user.id;

    // Check for existing reviews
    const existingReservations = await Reservation.find({
      user: req.user.id,
      restaurant: req.params.restaurantId,
    });
    const existingReview = await Review.find({
      user: req.user.id,
      restaurant: req.params.restaurantId,
    });

    // If the user is not an admin, they can only create 3 reviews
    if (existingReservations.length === 0 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} hasn't reserved any restaurants yet`,
      });
    }
    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: `This user already review`,
      });
    }

    // check review date after resDate
    //console.log(Date.now());
    //console.log(new Date(existingReservations[(existingReservations.length-1)].resDate).getTime()) ;\
    existingReservations.sort(
      (a, b) => new Date(a.resDate) - new Date(b.resDate)
    );

    //console.log(existingReservations);
    const dt = new Date(existingReservations[0].resDate).getTime();
    //console.log(dt);
    if (Date.now() < dt) {
      return res.status(400).json({
        success: false,
        message: `You can only review after the reservation date (${existingReservations[0].resDate})`,
      });
    }

    const review = await Review.create(req.body);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Review",
    });
  }
};

/**
 * @description Update a review
 * @route PUT /api/reviews/:id
 * @access Private
 */
exports.updateReview = async (req, res, next) => {
  // Make sure user is the review owner

  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No review with the id of ${req.params.id}`,
      });
    }
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this review`,
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update Review",
    });
  }
};

/**
 * @description Delete a review
 * @route DELETE /api/reviews/:id
 * @access Private
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No review with the id of ${req.params.id}`,
      });
    }
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this review`,
      });
    }
    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Review",
    });
  }
};

/**
 * @description Get reviews for a restaurant
 * @route GET /api/reviews/means/:id
 * @access Public
 */
exports.getReviewsForRestaurant = async (req, res, next) => {
  const restaurantID = req.params.id;

  try {
    // Find all reviews for the given restaurant ID
    const reviews = await Review.find({ restaurant: restaurantID });

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.reviewStar,
      0
    );
    const meanRating = totalRating / reviews.length;

    const restaurant = await Restaurant.findById(req.params.id);
    res.status(200).json({
      success: true,
      name: restaurant.name,
      totalRating: meanRating.toFixed(2),
      count: reviews.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};