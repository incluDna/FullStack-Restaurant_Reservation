const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
  updateUser,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.route("/me").get(protect, getMe).put(protect, updateUser);

router.get("/logout", logout);

module.exports = router;
