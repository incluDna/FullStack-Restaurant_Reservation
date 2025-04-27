const Restaurant = require('../../models/Restaurant');
const Menu = require('../../models/Menu');
const APIError = require('../../utils/APIError');
const asyncHandler = require('../../utils/asyncHandler');
const { isValidObjectId } = require('mongoose');

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