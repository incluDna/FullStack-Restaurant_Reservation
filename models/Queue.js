const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Queue must have a valid user reference"],
  },
  seatcount: {
    type: Number,
    required: [true, "Queue must have a seat-to-take amount"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = QueueSchema;
