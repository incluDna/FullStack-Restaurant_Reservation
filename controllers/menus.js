const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");
const APIFeatures = require("../utils/APIFeatures");
const APIError = require("../utils/APIError");
const asyncHandler = require("../utils/asyncHandler");
const { isValidObjectId } = require("mongoose");

/**
 * @description Get all menus
 * @route GET /api/restaurants/:restaurantId/menus
 * @access Public
 */
exports.getMenus = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.restaurantId)) {
    throw new APIError(`Invalid id: not an ObjectID`, 400);
  }

  const features = new APIFeatures(Menu.find({ restaurant: req.params.restaurantId }), req.query).filter().sort().limitFields();
  const menus = await features.query;

  return res.status(200).json({
    success: true,
    count: menus.length,
    data: menus,
  });
});

/**
 * @description Get single menu
 * @route GET /api/restaurants/:restaurantId/menus/:id
 * @access Public
 */
exports.getMenu = asyncHandler(async (req, res, next) => {
  const query = await Menu.findById(req.params.id);
  if (!query) {
    throw new APIError(`Menu not found`, 404);
  }

  return res.status(200).json({
    success: true,
    data: query,
  });
});

/**
 * @description Create menu
 * @route POST /api/restaurants/:restaurantId/menus
 * @access Private
 */
exports.createMenu = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.restaurantId)) {
    throw new APIError(`Invalid id: not an ObjectID`, 400);
  }

  const restaurant = await Restaurant.findById(req.params.restaurantId);
  if (!restaurant) {
    throw new APIError(`Restaurant not found`, 404);
  }

  req.body.restaurant = req.params.restaurantId;
  const menu = await Menu.create(req.body);

  return res.status(201).json({
    success: true,
    data: menu,
  });
});

/**
 * @description Update menu
 * @route PUT /api/restaurants/:restaurantId/menus/:id
 * @access Private
 */
exports.updateMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!menu) {
    throw new APIError(`Menu not found`, 404);
  }

  return res.status(200).json({
    success: true,
    data: menu,
  });
});

/**
 * @description Delete menu
 * @route DELETE /api/restaurants/:restaurantId/menus/:id
 * @access Private
 */
exports.deleteMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.findByIdAndDelete(req.params.id);

  if (!menu) {
    throw new APIError(`Menu not found`, 404);
  }

  return res.status(204).json({
    success: true,
    data: {},
  });
});
