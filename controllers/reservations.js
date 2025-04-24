const { isValidObjectId } = require("mongoose");
const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");
const APIFeatures = require("../utils/APIFeatures");
const asyncHandler = require("../utils/asyncHandler");
const { toMinutes } = require("../utils/parseTimes");

const restaurantPopulate = {
  path: "restaurant",
  select: "name province shortLocation tel",
};
const userPopulate = {
  path: "user",
  select: "name tel",
};

/**
 * @description Get all reservations
 * @route GET /api/reservations
 * @access Public
 */
exports.getReservations = asyncHandler(async (req, res, next) => {
  let baseQuery;
  if (req.user.role === "user") {
    baseQuery = Reservation.find({ user: req.user.id });
  } else if (req.params.restaurantId) {
    if (!isValidObjectId(req.params.restaurantId)) {
      throw new APIError(`Invalid id: not an ObjectID`, 400);
    }
    baseQuery = Reservation.find({ restaurant: req.params.restaurantId });
  } else {
    baseQuery = Reservation.find();
  }

  const features = new APIFeatures(baseQuery, req.query).filter().limitFields();

  const reservations = await features.query
    .sort({ resDate: 1 })
    .populate(restaurantPopulate)
    .populate(userPopulate);

  if (reservations.length === 0) {
    throw new APIError(`No reservations found`, 404);
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
    .populate(restaurantPopulate)
    .populate(userPopulate);

  if (!reservation) {
    throw new APIError(`No reservation with the id of ${req.params.id}`, 404);
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
    throw new APIError(`Invalid id: not an ObjectID`, 400);
  }
  req.body.restaurant = req.params.restaurantId;

  const restaurant = await Restaurant.findById(req.params.restaurantId);

  if (!restaurant) {
    throw new APIError(`No restaurant with the id of ${req.params.restaurantId}`, 404);
  }
  if (!checkValidTime(restaurant.openTime, restaurant.closeTime, req.body.resDate)) {
    throw new APIError(`Invalid reservation time: must be between open and close time`, 400);
  }

  req.body.user = req.user.id;
  const existingReservations = await Reservation.find({ user: req.user.id });

  if (existingReservations.length >= 3 && req.user.role !== "admin") {
    throw new APIError(`${req.user.name} has already made 3 reservations.`, 400);
  }

  const count = await countReservationInPeriod(req.params.restaurantId, req.body.resDate);
  if (count >= restaurant.reservationLimit) {
    throw new APIError(
      `${restaurant.name} is fully booked at this time. Choose a different time slot.`,
      400
    );
  }
  if (req.body.seatCount > restaurant.seatPerReservationLimit) {
    throw new APIError(
      `Your seat count of ${req.body.seatCount} exceeds the restaurant's limit of ${restaurant.seatPerReservationLimit}`,
      400
    );
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
exports.updateReservation = asyncHandler(async (req, res, next) => {
  // Make sure user is the reservation owner

  let reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new APIError(`No reservation with the id of ${req.params.id}`, 404);
  }

  if (reservation.user.toString() !== req.user.id && req.user.role !== "admin") {
    throw new APIError(`User ${req.user.id} is not authorized to update this reservation`, 403);
  }

  const restaurant = await Restaurant.findById(reservation.restaurant);
  if (!restaurant) {
    throw new APIError(`No restaurant with the id of ${reservation.restaurant}`, 404);
  }
  if (
    req.body.resDate &&
    !checkValidTime(restaurant.openTime, restaurant.closeTime, req.body.resDate)
  ) {
    throw new APIError(`Invalid reservation time: must be between open and close time`, 400);
  }
  if (req.body.seatCount && req.body.seatCount > restaurant.seatPerReservationLimit) {
    throw new APIError(
      `Your seat count of ${req.body.seatCount} exceeds the restaurant's limit of ${restaurant.seatPerReservationLimit}`,
      400
    );
  }

  reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: reservation,
  });
});

/**
 * @description Delete a reservation
 * @route /api/reservations/:id
 * @access Private
 */
exports.deleteReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    throw new APIError(`No reservation with the id of ${req.params.id}`, 404);
  }
  if (reservation.user.toString() !== req.user.id && req.user.role === "user") {
    throw new APIError(`User ${req.user.id} is not authorized to delete this reservation`, 403);
  }
  await reservation.deleteOne();

  res.status(204).json({
    success: true,
    data: {},
  });
});

function checkValidTime(openTime, closeTime, resDate) {
  const openMinutes = toMinutes(openTime);
  const closeMinutes = toMinutes(closeTime);

  const timePart = resDate.match(/T(\d{1,2}:\d{2})/)[1];
  const reservationHour = timePart.slice(0, 2);
  const reservationMin = timePart.slice(3);
  const reserveMinutes = parseInt(reservationHour) * 60 + parseInt(reservationMin);

  if (!(openMinutes <= reserveMinutes && reserveMinutes <= closeMinutes)) {
    return false;
  }
  return true;
}

async function countReservationInPeriod(restaurantId, startDate) {
  const newResDate = new Date(startDate);
  const endDate = new Date(newResDate.getTime() + 60 * 60 * 1000);
  const count = await Reservation.countDocuments({
    restaurant: restaurantId,
    resDate: { $gte: newResDate, $lte: endDate },
  });

  return count;
}
