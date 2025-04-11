const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");

/**
 * @description Get all reservations
 * @route GET /api/reservations
 * @access Public
 */
exports.getReservations = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    //general users can see only their reservations
    query = Reservation.find({ user: req.user.id }).populate({
      path: "restaurant",
      select: "name province tel",
    });
  } else {
    if (req.params.restaurantId) {
      console.log(req.params.restaurantId);
      query = Reservation.find({
        restaurant: req.params.restaurantId,
      }).populate({
        path: "restaurant",
        select: "name province tel",
      });
    } else {
      //if you are admin, you can see all reservations
      query = Reservation.find().populate({
        path: "restaurant",
        select: "name province tel",
      });
    }
  }
  try {
    const reservations = await query;
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Reservation",
    });
  }
};

/**
 * @description Get single reservation
 * @route GET /api/reservations/:id
 * @access Public
 */
exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate({
      path: "restaurant",
      select: "name description tel",
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Reservation",
    });
  }
};

/**
 * @description Add a reservation
 * @route /api/reservations/:id
 * @access Private
 */
exports.addReservation = async (req, res, next) => {
  try {
    req.body.restaurant = req.params.restaurantId;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: `No restaurant with the id of ${req.params.restaurantId}`,
      });
    }
    if (
      !checkValidTime(
        restaurant.openTime,
        restaurant.closeTime,
        req.body.resDate
      )
    ) {
      return res.status(400).json({
        success: false,
        msg: "Cannot make reservation",
      });
    }

    // Add user ID to req.body
    req.body.user = req.user.id;

    // Check for existing reservations
    const existingReservations = await Reservation.find({ user: req.user.id });

    // If the user is not an admin, they can only create 3 reservations
    if (existingReservations.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 reservations`,
      });
    }

    const newResDate = new Date(req.body.resDate);

    // Calculate the end time 60 minutes from newResDate
    const endDate = new Date(newResDate.getTime() + 60 * 60 * 1000);

    // Count reservations that are at the same restaurant and within the specified time window
    const count = await Reservation.countDocuments({
      restaurant: req.params.restaurantId, // Ensure the restaurant is correctly referenced
      resDate: { $gte: newResDate, $lt: endDate }, // Find reservations from newResDate (inclusive) to 60 minutes later
    });

    if (count >= restaurant.reservationLimit) {
      return res.status(400).json({
        success: false,
        message: `The restaurant with ID ${req.params.restaurantId} has reached its reservation limit`,
      });
    }
    if (req.body.seatCount > restaurant.seatPerReservationLimit) {
      return res.status(400).json({
        success: false,
        message: `The seat count exceeds the limit of ${restaurant.seatPerReservationLimit}`,
      });
    }

    const reservation = await Reservation.create(req.body);

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Reservation",
    });
  }
};

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
        req.body.resDate
      )
    ) {
      return res.status(400).json({
        success: false,
        msg: "Cannot update reservation: Invalid time",
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
      req.user.role !== "admin"
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
  const openHour = openTime.slice(0, 2);
  const closeHour = closeTime.slice(0, 2);
  const openMin = openTime.slice(3);
  const closeMin = closeTime.slice(3);
  const openMiniutes = parseInt(openHour) * 60 + parseInt(openMin);
  const closeMiniutes = parseInt(closeHour) * 60 + parseInt(closeMin);

  const timePart = resDate.match(/T(\d{1,2}:\d{2})/)[1];
  const reservationHour = timePart.slice(0, 2);
  const reservationMin = timePart.slice(3);
  const reserveMiniutes =
    parseInt(reservationHour) * 60 + parseInt(reservationMin);

  if (!(openMiniutes <= reserveMiniutes && reserveMiniutes <= closeMiniutes)) {
    return false;
  }
  return true;
}
