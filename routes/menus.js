const express = require("express");
const { getMenus, getMenu, createMenu, updateMenu, deleteMenu } = require("../controllers/menus");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Menus
 *   description: The menu managing API
 */

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
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the menu
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
 *       example:
 *         id: 60c72b2f5f1b2c001c8e4b8d
 *         name: Pad Thai
 *         price: 120
 *         type: dish
 *         description: Thai stir-fried noodles
 *         image: https://example.com/images/padthai.jpg
 */

/**
 * @swagger
 * /menus:
 *   get:
 *     summary: Get all menus
 *     tags: [Menus]
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
 *     summary: Create a new menu
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: The created menu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 */
router.route("/")
  .get(getMenus)
  .post(protect, authorize("employee", "admin"), createMenu);

/**
 * @swagger
 * /menus/{id}:
 *   get:
 *     summary: Get a menu by ID
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested menu
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
 *         name: id
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: The updated menu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu'
 *   delete:
 *     summary: Delete a menu by ID
 *     tags: [Menus]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Menu ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 */
router.route("/:id")
  .get(getMenu)
  .put(protect, authorize("employee", "admin"), updateMenu)
  .delete(protect, authorize("employee", "admin"), deleteMenu);

module.exports = router;
