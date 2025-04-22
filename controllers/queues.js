const Queue = require("../models/Queue");
const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../utils/asyncHandler");
const APIFeatures = require("../utils/APIFeatures");

exports.getQueues = asyncHandler(async (req, res, next) => {
  let features = new APIFeatures(null, req.query);

  if (req.params.restaurantId && req.user.role !== "user") {
    features.query = Queue.find({ restaurant: req.params.restaurantId });
  } else if (!req.params.restaurantId && req.user.role === "user") {
    features.query = Queue.find({ user: req.user.id });
  } else {
    const error = new Error(`User cannot access this resource`);
    error.statusCode = 403;
    throw error;
  }

  const queues = await features.query.sort({ createdAt: 1 }).populate({
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
  let features = new APIFeatures(null, req.query);
  if (!req.params.restaurantId) {
    const error = new Error(
      `Restaurant ID not provided: please access through a restaurant`
    );
    error.statusCode = 400;
    throw error;
  }

  const allQueues = await Queue.find({
    restaurant: req.params.restaurantId,
  }).sort({ createdAt: 1 });
  const thisQueue = await Queue.findById(req.params.id);
  const index = allQueues.findIndex(
    (queue) => queue._id.toString() === thisQueue._id.toString()
  );
  if (index === -1) {
    const error = new Error(`Cannot find queue in restaurant. How?`);
    error.statusCode = 500;
    throw error;
  }

  return res.status(200).json({
    success: true,
    position: index,
    queue: thisQueue,
  });
});

exports.createQueue = asyncHandler(async (req, res, next) => {
  if (!req.params.restaurantId) {
    const error = new Error(
      `Restaurant ID not provided: please access through a restaurant`
    );
    error.statusCode = 400;
    throw error;
  }

  req.body.user = req.user.id;
  req.body.restaurant = req.params.restaurantId;

  const queue = await Queue.create(req.body);

  return res.status(201).json({
    success: true,
    data: queue,
  });
});

exports.updateQueueStatus = asyncHandler(async (req, res, next) => {
  const queue = await Queue.findById(req.params.id);

  if (!queue) {
    const error = new Error(`No queue with the id of ${req.params.id}`);
    error.statusCode = 404;
    throw error;
  }

  queue.queueStatus = req.body.status;
  await queue.save();

  return res.status(200).json({
    success: true,
    data: queue,
  });
});

exports.deleteQueue = asyncHandler(async (req, res, next) => {
  const queue = await Queue.findById(req.params.id);

  if (!queue) {
    const error = new Error(`No queue with the id of ${req.params.id}`);
    error.statusCode = 404;
    throw error;
  }
  if (
    (req.user.role === "user" && queue.user.toString() !== req.user.id) ||
    (req.user.role === "employee" &&
      queue.restaurant.toString() !== req.user.employedAt)
  ) {
    const error = new Error(
      `Role ${req.user.role} cannot access this resource`
    );
    error.statusCode = 403;
    throw error;
  }

  await Queue.findByIdAndDelete(req.params.id);

  return res.status(204).json({
    success: true,
    data: null,
  });
});
