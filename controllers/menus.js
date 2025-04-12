const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");

/**
 * @description Get all menus
 * @route GET /api/menus
 * @access Public
 */
exports.getMenus = async (req, res, next) => {
  if (!req.params.restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Please provide restaurantId",
    });
  }

  try {
    const query = await Menu.find({ restaurant: req.params.restaurantId });
    return res.status(200).json({
      success: true,
      count: query.length,
      data: query,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Menu",
    });
  }
};

/**
 * @description Get single menu
 * @route GET /api/menus/:id
 * @access Public
 */
exports.getMenu = async (req, res, next) => {
  if (!req.params.restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Please provide restaurantId",
    });
  }
  
  try {
    const query = await Menu.findById(req.params.id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: query,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot find Menu",
    });
  }
};
