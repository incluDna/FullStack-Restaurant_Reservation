const Queue = require("../models/Queue");
const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../utils/asyncHandler");
const APIFeatures = require("../utils/APIFeatures");
const APIError = require("../utils/APIError");

const restaurantPopulate = {
  path: "restaurant",
  select: "name province shortLocation tel",
};
const userPopulate = {
  path: "user",
  select: "name tel",
};

/**
 * @description Get all queues
 * @route GET /api/queues | /api/restaurants/:restaurantId/queues
 * @access Private
 */
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
    .populate(restaurantPopulate)
    .populate(userPopulate);

  return res.status(200).json({
    success: true,
    count: queues.length,
    data: queues,
  });
});

/**
 * @description Get all incomplete queues
 * @route GET /api/queues/incomplete | /api/restaurants/:restaurantId/queues/incomplete
 * @access Private
 */
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
    .populate(restaurantPopulate)
    .populate(userPopulate);

  return res.status(200).json({
    success: true,
    count: queues.length,
    data: queues,
  });
});

exports.pollIncompleteQueues = asyncHandler(async (req, res, next) => {
  const MAX_WAIT = 25_000;   // Vercel hard-limit safety
  const SLEEP    = 1_000;    // DB probe interval

  // ---------- 1. build the *same* base query you already use ----------
  let baseQuery;
  if (req.params.restaurantId && req.user.role !== 'user') {
    baseQuery = Queue.find({
      restaurant : req.params.restaurantId,
      queueStatus: { $ne: 'completed' },
    });
  } else if (!req.params.restaurantId && req.user.role === 'user') {
    baseQuery = Queue.find({
      user       : req.user.id,
      queueStatus: { $ne: 'completed' },
    });
  } else {
    throw new APIError('User cannot access this resource', 403);
  }

  // ---------- 2. get the client’s last snapshot ----------
  // we use a POSIX time-stamp (ms since epoch)
  const since = Number(req.query.since ?? 0);

  const deadline = Date.now() + MAX_WAIT;
  while (Date.now() < deadline) {
    /* 2a ▸ fetch the newest change time among the matching docs.
            Thanks to the {restaurant, updatedAt} index this is O(log n). */
    const latest = await baseQuery
      .sort({ updatedAt: -1 })
      .select('updatedAt')
      .lean()          // no mongoose hydration
      .limit(1);

    const latestTs = latest[0]?.updatedAt?.getTime() ?? 0;

    /* 2b ▸ If the list changed since client’s last version, send data */
    if (latestTs > since) {
      const features = new APIFeatures(baseQuery, req.query)
        .filter()
        .limitFields();          // keep your existing helpers

      const queues = await features.query
        .sort({ createdAt: 1 })
        .populate(restaurantPopulate)
        .populate(userPopulate);

      return res.json({
        version: latestTs,        // ← client sends this back next time
        count  : queues.length,
        data   : queues,
      });
    }

    /* 2c ▸ Nothing new yet – wait a bit */
    await new Promise(r => setTimeout(r, SLEEP));
  }

  /* 3 ▸  Timed out – let the client restart immediately */
  res.status(204).end();
});

/**
 * @description Get a queue's position
 * @route GET /api/restaurants/:restaurantId/queues/:id/position
 * @access Private
 */
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
    throw new APIError(`Queue not found`, 404);
  }

  return res.status(200).json({
    success: true,
    position: index,
    data: thisQueue,
  });
});

exports.pollQueueState = asyncHandler(async (req, res, next) => {
  const MAX_WAIT = 25_000; // 25 s Vercel hard-limit safety
  const SLEEP = 1_000; // pause between probes

  const { id } = req.params;
  const since = Number(req.query.since || 0); // last version the client saw
  const deadline = Date.now() + MAX_WAIT;

  while (Date.now() < deadline) {
    // We only need a few fields to decide and to calculate the rank
    const q = await Queue.findById(id).select("__v queueStatus restaurant createdAt");
    if (!q) return res.status(404).end(); // queue vanished

    /* 1️⃣ Has anything changed since the client’s last snapshot? */
    if (q.__v > since) {
      /* 2️⃣  If yes, figure out where the ticket now stands         */
      const position = await Queue.countDocuments({
        restaurant: q.restaurant,
        queueStatus: { $ne: "completed" },
        createdAt: { $lt: q.createdAt }, // strictly before us
      });

      /* 3️⃣  Send the full update in one go                         */
      return res.json({
        version: q.__v,
        status: q.queueStatus,
        position,
      });
    }

    /* 4️⃣  Nothing new yet – sleep a bit and try again              */
    await new Promise((r) => setTimeout(r, SLEEP));
  }

  /* 5️⃣  Timed out – client may reconnect immediately               */
  res.status(204).end();
});

/**
 * @description Create a queue
 * @route POST /api/restaurants/:restaurantId/queues
 * @access Private
 */
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

/**
 * @description Update a queue's status
 * @route PUT /api/queues/:id | /api/restaurants/:restaurantId/queues/:id
 * @access Private
 */
exports.updateQueueStatus = asyncHandler(async (req, res, next) => {
  let queue = await Queue.findById(req.params.id);

  if (!queue) {
    throw new APIError("Queue not found", 404);
  }

  if (req.body.queueStatus === undefined) {
    throw new APIError(`Queue status not provided`, 400);
  }

  queue.queueStatus = req.body.queueStatus;
  await queue.save();

  return res.status(200).json({
    success: true,
    data: queue,
  });
});

/**
 * @description Delete a queue
 * @route DELETE /api/queues/:id | /api/restaurants/:restaurantId/queues/:id
 * @access Private
 */
exports.deleteQueue = asyncHandler(async (req, res, next) => {
  const queue = await Queue.findById(req.params.id);

  if (!queue) {
    throw new APIError("Queue not found", 404);
  }
  if (
    (req.user.role === "user" && !queue.user.equals(req.user.id)) ||
    (req.user.role === "employee" && !queue.restaurant.equals(req.user.employedAt))
  ) {
    throw new APIError(`User is not authorized to delete this queue`, 403);
  }

  await Queue.findByIdAndDelete(req.params.id);

  return res.status(204).json({
    success: true,
    data: {},
  });
});
