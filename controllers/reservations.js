const { isValidObjectId } = require("mongoose");
const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");
const APIFeatures = require("../utils/APIFeatures");
const asyncHandler = require("../utils/asyncHandler");
const { toMinutes } = require("../utils/parseTimes");

/**
 * @description Get all reservations
 * @route GET /api/reservations
 * @access Public
 */
exports.getReservations = asyncHandler(async (req, res, next) => {
  let features = new APIFeatures(null, req.query);

  const restaurantPopulate = {
    path: "restaurant",
    select: "name province tel",
  };

  const userPopulate = {
    path: "user",
    select: "name tel",
  };

  if (req.user.role === "user") {
    features.query = Reservation.find({ user: req.user.id });
  } else {
    if (req.params.restaurantId) {
      if (!isValidObjectId(req.params.restaurantId)) {
        const error = new Error(
          `Invalid restaurant ID format: Not an ObjectID`,
        );
        error.statusCode = 400;
        throw error;
      }

      features.query = Reservation.find({
        restaurant: req.params.restaurantId,
      });
    } else if (req.user.role === "admin") {
      features.query = Reservation.find();
    }
  }

  const reservations = await features.query
    .sort({ resDate: 1 })
    .populate(restaurantPopulate)
    .populate(userPopulate);

  if (reservations.length === 0) {
    const error = new Error(`No reservations found`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
});

/**
 * @description Get single reservation
 * @route GET /api/reservations/:id
 * @access Public
 */
exports.getReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id)
  .populate({
    path: "restaurant",
    select: "name description tel",
  })
  .populate({
    path: "user",
    select: "name tel",
  });

  if (!reservation) {
    const error = new Error(`No reservation with the id of ${req.params.id}`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: reservation,
  });
});

/**
 * @description Add a reservation
 * @route /api/reservations/:id
 * @access Private
 */
exports.addReservation = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.restaurantId)) {
    const error = new Error(`Invalid id: not an ObjectID`);
    error.statusCode = 400;
    throw error;
  }
  req.body.restaurant = req.params.restaurantId;

  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    const error = new Error(
      `No restaurant with the id of ${req.params.restaurantId}`,
    );
    error.statusCode = 404;
    throw error;
  }
  if (
    !checkValidTime(restaurant.openTime, restaurant.closeTime, req.body.resDate)
  ) {
    const error = new Error(
      `Invalid reservation time: must be between open and close time`,
    );
    error.statusCode = 400;
    throw error;
  }

  req.body.user = req.user.id;
  const existingReservations = await Reservation.find({ user: req.user.id });

  if (existingReservations.length >= 3 && req.user.role !== "admin") {
    const error = new Error(`${req.user.name} has already made 3 reservations`);
    error.statusCode = 400;
    throw error;
  }

  const newResDate = new Date(req.body.resDate);
  const endDate = new Date(newResDate.getTime() + 60 * 60 * 1000);

  const count = await Reservation.countDocuments({
    restaurant: req.params.restaurantId,
    resDate: { $gte: newResDate, $lt: endDate },
  });

  if (count >= restaurant.reservationLimit) {
    const error = new Error(
      `${restaurant.name} is fully booked at this time. Choose a different time slot.`,
    );
    error.statusCode = 400;
    throw error;
  }
  if (req.body.seatCount > restaurant.seatPerReservationLimit) {
    const error = new Error(
      `Your seat count of ${req.body.seatCount} exceeds the restaurant's limit of ${restaurant.seatPerReservationLimit}`,
    );
    error.statusCode = 400;
    throw error;
  }

  const reservation = await Reservation.create(req.body);

  res.status(200).json({
    success: true,
    data: reservation,
  });
});

/**
 * @description Update a reservation
 * @route /api/reservations/:id
 * @access Private
 */
exports.updateReservation = async (req, res, next) => {
  // Make sure user is the reservation owner

  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this reservation`,
      });
    }

    const restaurant = await Restaurant.findById(reservation.restaurant);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `No restaurant with the id of ${reservation.restaurant}`,
      });
    }
    if (
      req.body.resDate &&
      !checkValidTime(
        restaurant.openTime,
        restaurant.closeTime,
        req.body.resDate,
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot update reservation: Invalid time",
      });
    }
    if (
      req.body.seatCount &&
      req.body.seatCount > restaurant.seatPerReservationLimit
    ) {
      return res.status(400).json({
        success: false,
        message: `The seat count exceeds the limit of ${restaurant.seatPerReservationLimit}`,
      });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update Reservation",
    });
  }
};

/**
 * @description Delete a reservation
 * @route /api/reservations/:id
 * @access Private
 */
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role === "user"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this reservation`,
      });
    }
    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Reservation",
    });
  }
};

function checkValidTime(openTime, closeTime, resDate) {
  const openMinutes = toMinutes(openTime);
  const closeMinutes = toMinutes(closeTime);

  const timePart = resDate.match(/T(\d{1,2}:\d{2})/)[1];
  const reservationHour = timePart.slice(0, 2);
  const reservationMin = timePart.slice(3);
  const reserveMinutes =
    parseInt(reservationHour) * 60 + parseInt(reservationMin);

  if (!(openMinutes <= reserveMinutes && reserveMinutes <= closeMinutes)) {
    return false;
  }
  return true;
}
