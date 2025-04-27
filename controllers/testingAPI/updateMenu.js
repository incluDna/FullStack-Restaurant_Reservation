const Restaurant = require('../../models/Restaurant');
const Menu = require('../../models/Menu');
const APIError = require('../../utils/APIError');
const asyncHandler = require('../../utils/asyncHandler');

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