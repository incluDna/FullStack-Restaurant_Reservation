const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Queue must have a valid restaurant reference"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Queue must have a valid user reference"],
    },
    seatCount: {
      type: Number,
      required: [true, "Queue must have a seat-to-take amount"],
    },
    queueStatus: {
      type: String,
      enum: ["waiting", "calling", "completed"],
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
);

QueueSchema.index({ restaurant: 1, createdAt: 1 });
QueueSchema.index({ restaurant: 1, updatedAt: 1 });

module.exports = mongoose.model("Queue", QueueSchema);
