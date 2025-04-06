const mongoose = require("mongoose");
const Reservation = require("./Reservation");
const Review = require("./Review");
const Queue = require("./Queue");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postal Code cannot be more than 5 digits"],
    },
    tel: {
      type: String,
      required: [true, "Please add telephone number"],
      match: [/^\d{10}$/, "Please add valid telephone number"],
    },
    region: {
      type: String,
      required: [true, "Please add a region"],
    },
    opentime: {
      type: String,
      required: [true, "Please add a Open Time"],
      match: [
        /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        "Time must be in the format HH:MM using a 24-hour clock",
      ],
    },
    closetime: {
      type: String,
      required: [true, "Please add a Close Time"],
      match: [
        /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        "Time must be in the format HH:MM using a 24-hour clock",
      ],
    },
    picture: {
      type: String,
      required: [true, "Please add a Picture Link"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reverse populate with virtuals
RestaurantSchema.virtual("queues", {
  ref: "Queue",
  localField: "_id",
  foreignField: "restaurant",
  options: { sort: { createdAt: 1 } },
  justOne: false,
});
RestaurantSchema.virtual("reservations", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});
RestaurantSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
