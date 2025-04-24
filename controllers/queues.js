const Queue = require("../models/Queue");
const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../utils/asyncHandler");
const APIFeatures = require("../utils/APIFeatures");
const APIError = require("../utils/APIError");

exports.getQueues = asyncHandler(async (req, res, next) => {
  let baseQuery;
  if (req.params.restaurantId && req.user.role !== "user") {
    baseQuery = Queue.find({ restaurant: req.params.restaurantId });
  } else if (!req.params.restaurantId && req.user.role === "user") {
    baseQuery = Queue.find({ user: req.user.id });
  } else {
    throw new APIError(`User cannot access this resource`, 403);
  }

  const features = new APIFeatures(baseQuery, req.query).filter().limitFields();
  const queues = await features.query
    .sort({ createdAt: 1 })
    .populate({
      path: "restaurant",
      select: "name province tel",
    })
    .populate({
      path: "user",
      select: "name tel",
    });

  return res.status(200).json({
    success: true,
    count: queues.length,
    data: queues,
  });
});

exports.getIncompleteQueues = asyncHandler(async (req, res, next) => {
  let baseQuery;
  if (req.params.restaurantId && req.user.role !== "user") {
    baseQuery = Queue.find({
      restaurant: req.params.restaurantId,
      queueStatus: { $ne: "completed" },
    });
  } else if (!req.params.restaurantId && req.user.role === "user") {
    baseQuery = Queue.find({ user: req.user.id, queueStatus: { $ne: "completed" } });
  } else {
    throw new APIError(`User cannot access this resource`, 403);
  }

  const features = new APIFeatures(baseQuery, req.query).filter().limitFields();
  const queues = await features.query
    .sort({ createdAt: 1 })
    .populate({
      path: "restaurant",
      select: "name province tel",
    })
    .populate({
      path: "user",
      select: "name tel",
    });

  return res.status(200).json({
    success: true,
    count: queues.length,
    data: queues,
  });
});

exports.getQueuePosition = asyncHandler(async (req, res, next) => {
  if (!req.params.restaurantId) {
    throw new APIError(`Restaurant ID not provided: please access through a restaurant`, 400);
  }

  const allQueues = await Queue.find({
    restaurant: req.params.restaurantId,
    queueStatus: { $ne: "completed" },
  }).sort({ createdAt: 1 });
  const thisQueue = await Queue.findById(req.params.id);

  const index = allQueues.findIndex((queue) => queue._id.toString() === thisQueue._id.toString());
  if (index === -1) {
    throw new APIError(`Somehow, no queue with the id of ${req.params.id}`, 404);
  }

  return res.status(200).json({
    success: true,
    position: index,
    data: thisQueue,
  });
});

exports.createQueue = asyncHandler(async (req, res, next) => {
  if (!req.params.restaurantId) {
    throw new APIError(`Restaurant ID not provided: please access through a restaurant`, 400);
  }

  req.body.user = req.user.id;
  req.body.restaurant = req.params.restaurantId;

  // Check if the user is already in a queue for this restaurant
  const exists = await Queue.exists({
    user: req.user.id,
    restaurant: req.params.restaurantId,
  });
  if (exists) {
    throw new APIError(`You already have a queue in this restaurant`, 400);
  }

  // Ensure seatCount is not greater than the restaurant's limit
  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (req.body.seatCount > restaurant.seatPerReservationLimit) {
    throw new APIError(
      `This restaurant does not allow reserving more than ${restaurant.seatPerReservationLimit} seats`,
      400
    );
  }

  const queue = await Queue.create(req.body);

  return res.status(201).json({
    success: true,
    data: queue,
  });
});

exports.updateQueueStatus = asyncHandler(async (req, res, next) => {
  let queue = await Queue.findById(req.params.id);

  if (!queue) {
    throw new APIError(`No queue with the id of ${req.params.id}`, 404);
  }

  if (req.body.queueStatus === undefined) {
    throw new APIError(`Queue status not provided`, 400);
  }

  queue = await Queue.findByIdAndUpdate(
    req.params.id,
    { queueStatus: req.body.queueStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: queue,
  });
});

exports.deleteQueue = asyncHandler(async (req, res, next) => {
  const queue = await Queue.findById(req.params.id);

  if (!queue) {
    throw new APIError(`No queue with the id of ${req.params.id}`, 404);
  }
  if (
    (req.user.role === "user" && !queue.user.equals(req.user.id)) ||
    (req.user.role === "employee" && !queue.restaurant.equals(req.user.employedAt))
  ) {
    throw new APIError(`User ${req.user.id} is not authorized to delete this queue`, 403);
  }

  await Queue.findByIdAndDelete(req.params.id);

  return res.status(204).json({
    success: true,
    data: {},
  });
});
