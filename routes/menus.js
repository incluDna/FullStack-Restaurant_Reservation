const express = require("express");
const { getMenus, getMenu, createMenu, updateMenu, deleteMenu } = require("../controllers/menus");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getMenus).post(protect, authorize("employee", "admin"), createMenu);
router
  .route("/:id")
  .get(getMenu)
  .put(protect, authorize("employee", "admin"), updateMenu)
  .delete(protect, authorize("employee", "admin"), deleteMenu);

module.exports = router;
