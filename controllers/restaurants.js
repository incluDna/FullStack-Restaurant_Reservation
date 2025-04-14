const Restaurant = require("../models/Restaurant");
const Reservation = require("../models/Reservation");
const Review = require("../models/Review");
const Queue = require("../models/Queue");

/**
 * @description Get all restaurants
 * @route GET /api/restaurants
 * @access Public
 */
exports.getRestaurants = async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log(reqQuery);

  // query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = Restaurant.find(JSON.parse(queryStr))
    .populate("reservations")
    .populate("reviews");

  console.log(queryStr);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const total = await Restaurant.countDocuments();
    const totalPages = Math.ceil(total / limit);
    query = query.skip(startIndex).limit(limit);
    // excutue query
    const restaurants = await query;

    // Pagination result
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
      count: restaurants.length,
      data: restaurants,
      totalPages: totalPages,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @description Get single restaurant
 * @route GET /api/restaurants/:id
 * @access Public
 */
exports.getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @description Create a restaurant
 * @route POST /api/restaurants
 * @access Private
 */
exports.createRestaurant = async (req, res, next) => {
  const openHour = req.body.openTime.slice(0, 2);
  const closeHour = req.body.closeTime.slice(0, 2);
  const openMin = req.body.openTime.slice(3);
  const closeMin = req.body.closeTime.slice(3);
  //console.log(parseInt(openHour));
  if (
    isNaN(parseInt(openHour)) ||
    isNaN(parseInt(closeHour)) ||
    isNaN(parseInt(openMin)) ||
    isNaN(parseInt(closeMin))
  ) {
    return res.status(400).json({
      success: false,
      msg: "Cannot make restaurant",
    });
  }
  const openMinitues = parseInt(openHour) * 60 + parseInt(openMin);
  const closeMinitues = parseInt(closeHour) * 60 + parseInt(closeMin);

  // console.log(openMinitues);
  // console.log(closeMinitues);
  if (
    openMinitues >= closeMinitues ||
    closeMinitues > 1440 ||
    openMinitues > 1440
  ) {
    return res.status(400).json({
      success: false,
      msg: "Cannot make restaurant",
    });
  }
  console.log(req.body);
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({ success: true, data: restaurant });
};

/**
 * @description Update a restaurant
 * @route PUT /api/restaurants/:id
 * @access Private
 */
exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurant) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/**
 * @description Delete a restaurant
 * @route DELETE /api/restaurants/:id
 * @access Private
 */
exports.deleteRestaurant = async (req, res, next) => {
  try {
    //const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(400).json({ success: false });
    }

    await Queue.deleteMany({ restaurant: req.params.id });
    await Reservation.deleteMany({ restaurant: req.params.id });
    await Review.deleteMany({ restaurant: req.params.id });
    await Restaurant.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
