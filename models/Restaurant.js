const mongoose = require("mongoose");
const Reservation = require("./Reservation");
const Review = require("./Review");
const QueueSchema = require("./Queue");



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
      minlength: 5,
      maxlength: [5, "Please label time in 24hr system"],
    },
    closetime: {
      type: String,
      required: [true, "Please add a Close Time"],
      minlength: 5,
      maxlength: [5, "Please label time in 24hr system"],
    },
    picture: {
      type: String,
      required: [true, "Please add a Picture Link"],
    },
    queue: {
      type: [QueueSchema],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reverse populate with virtuals
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
