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
 *         - restaurant
 *         - picture
 *         - price
 *         - type
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated menu ID
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant this menu belongs to
 *         name:
 *           type: string
 *           description: Name of the menu item
 *         picture:
 *           type: string
 *           description: URL or path of the menu picture
 *         price:
 *           type: number
 *           description: Price of the menu item
 *         type:
 *           type: string
 *           enum: [dish, drink, set]
 *           description: Type of the menu item
 *         description:
 *           type: string
 *           description: Menu description (max 300 characters)
 *         tag:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Spicy
 *               - Vegan
 *               - Gluten-free
 *               - Dairy-free
 *               - Nut-free
 *               - Halal
 *               - Locally-sourced
 *               - Signature-dish
 *               - Seasonal
 *               - Sustainable
 *               - Vegetarian
 *               - null
 *           description: List of tags for the menu item
 *       example:
 *         id: 660abc123def456ghi789jk
 *         restaurant: 662e37cfd331b7e36d84a1c1
 *         name: Pad Thai
 *         picture: https://example.com/pictures/padthai.jpg
 *         price: 120
 *         type: dish
 *         description: Authentic Thai stir-fried noodles
 *         tag: ["Spicy", "Signature-dish"]
 */

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: Manage menus inside a restaurant
 */

/**
 * @swagger
 * /restaurants/{restaurantId}/menus:
 *   get:
 *     summary: Get all menus for a specific restaurant
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: The restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of menus
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
  .get(protect, getMenus)
  .post(protect, authorize("employee", "admin"), createMenu);

/**
 * @swagger
 * /restaurants/{restaurantId}/menus/{id}:
 *   get:
 *     summary: Get a specific menu by ID
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
 *     responses:
 *       200:
 *         description: Menu data
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
 *         schema:
 *           type: string
 *         description: Restaurant ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu ID
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
  .get(protect, getMenu)
  .put(protect, authorize("employee", "admin"), updateMenu)
  .delete(protect, authorize("employee", "admin"), deleteMenu);

module.exports = router;
