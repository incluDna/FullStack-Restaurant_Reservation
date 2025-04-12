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

/**
 * @description Create menu
 * @route POST /api/menus
 * @access Private
 */
exports.createMenu = async (req, res, next) => {
  if (!req.params.restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Please provide restaurantId",
    });
  }

  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    req.body.restaurant = req.params.restaurantId;
    const menu = await Menu.create(req.body);

    return res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Menu",
    });
  }
};

/**
 * @description Update menu
 * @route PUT /api/menus/:id
 * @access Private
 */
exports.updateMenu = async (req, res, next) => {
  if (!req.params.restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Please provide restaurantId",
    });
  }

  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update Menu",
    });
  }
};

/**
 * @description Delete menu
 * @route DELETE /api/menus/:id
 * @access Private
 */
exports.deleteMenu = async (req, res, next) => {
  if (!req.params.restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Please provide restaurantId",
    });
  }

  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);

    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Menu",
    });
  }
};
