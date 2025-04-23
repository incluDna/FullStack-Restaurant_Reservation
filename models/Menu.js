const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["dish", "drink", "set"],
    required: true,
    default: "dish",
  },
  description: {
    type: String,
    required: true,
    maxLength: 300,
  },
  tag: {
    type: [String],
    enum: [
      "Spicy",
      "Vegan",
      "Gluten-free",
      "Dairy-free",
      "Nut-free",
      "Halal",
      "Locally-sourced",
      "Signature-dish",
      "Seasonal",
      "Sustainable",
      "Vegetarian",
      null,
    ],
    default: null,
  },
});

module.exports = mongoose.model("Menu", MenuSchema);
