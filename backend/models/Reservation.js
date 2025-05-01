const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  resDate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  seatCount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReservationSchema.pre("validate", function (next) {
  if (!Number.isInteger(this.seatCount)) {
    this.invalidate("seatCount", "Seat count must be an integer");
  }
  next();
});

module.exports = mongoose.model("Reservation", ReservationSchema);
