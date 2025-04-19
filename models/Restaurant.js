const mongoose = require("mongoose");

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
    postalCode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postal Code cannot be more than 5 digits"],
    },
    shortLocation: {
      type: String,
      required: [true, "Please add a short location of your restaurant"],
      maxlength: [30, "Short location cannot contain more than 30 characters"],
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
    openTime: {
      type: String,
      required: [true, "Please add a Open Time"],
      match: [
        /^(?:[01]\d|2[0-3]):[0-5]\d$/,
        "Time must be in the format HH:MM using a 24-hour clock",
      ],
    },
    closeTime: {
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
    reservationLimit: {
      type: Number,
      required: [true, "Please add a Reservation Limit"],
      min: 0,
    },
    seatPerReservationLimit: {
      type: Number,
      required: [true, "Please add a Seat Per Reservation Limit"],
      min: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

RestaurantSchema.pre("validate", function (next) {
  if (this.openTime && this.closeTime && this.openTime >= this.closeTime) {
    this.invalidate("openTime", "Open time must be before close time");
  }
  if (!Number.isInteger(this.reservationLimit)) {
    this.invalidate("reservationLimit", "Reservation limit must be an integer");
  }
  if (!Number.isInteger(this.seatPerReservationLimit)) {
    this.invalidate(
      "seatPerReservationLimit",
      "Seat per reservation limit must be an integer",
    );
  }
  next();
});

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
