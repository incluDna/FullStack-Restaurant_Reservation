const express = require("express");
const { getMenus, getMenu, createMenu, updateMenu, deleteMenu } = require("../controllers/menus");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - type
 *         - restaurant
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the menu
 *         restaurant:
 *           type: string
 *           description: Restaurant ID this menu belongs to
 *         name:
 *           type: string
 *           description: Name of the menu item
 *         price:
 *           type: number
 *           description: Price of the menu item
 *         type:
 *           type: string
 *           enum: [dish, drink, set]
 *           description: Type of the menu item
 *         description:
 *           type: string
 *           description: Description of the menu item
 *         image:
 *           type: string
 *           description: URL of the menu image
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 60c72b2f5f1b2c001c8e4b8d
 *         restaurant: 660abc1234def56789abcdef
 *         name: Pad Thai
 *         price: 120
 *         type: dish
 *         description: Thai stir-fried noodles
 *         image: https://example.com/images/padthai.jpg
 *         createdAt: "2024-04-28T09:00:00.000Z"
 *         updatedAt: "2024-04-28T09:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: The menu managing API
 */

/**
 * @swagger
 * /restaurants/{restaurantId}/menus:
 *   get:
 *     summary: Get all menus for a restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: ID of the restaurant
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *   post:
 *     summary: Create a new menu for a restaurant
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: ID of the restaurant
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menu created successfully
 */
router.route("/")
  .get(getMenus)
  .post(protect, authorize("employee", "admin"), createMenu);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{id}:
 *   get:
 *     summary: Get a menu by ID under a restaurant
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: ID of the restaurant
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the menu
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *   put:
 *     summary: Update a menu by ID
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *   delete:
 *     summary: Delete a menu by ID
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       204:
 *         description: Menu deleted successfully
 */
router.route("/:id")
  .get(getMenu)
  .put(protect, authorize("employee", "admin"), updateMenu)
  .delete(protect, authorize("employee", "admin"), deleteMenu);

module.exports = router;
