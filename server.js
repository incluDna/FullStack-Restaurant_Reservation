const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// route files
const restaurants = require("./routes/restaurants");
const reservations = require("./routes/reservations");
const review = require("./routes/reviews");
const queues = require("./routes/queues");
const auth = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");

// require models
require("./models/Queue");
require("./models/Reservation");
require("./models/Restaurant");
require("./models/Review");
require("./models/User");

dotenv.config({ path: "./config/config.env" });

connectDB();

// express
const app = express();
app.use(express.json());

// libraries
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

// rate limiting
const limiter = rateLimit({
  windowsMs: 1 * 60 * 1000, // 10 minutes
  max: 200,
});
app.use(limiter);

// use routes
app.use("/api/restaurants", restaurants);
app.use("/api/reservations", reservations);
app.use("/api/reviews", review);
app.use("/api/auth", auth);
app.use("/api/queues", queues);

app.use(errorHandler);

// configs
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in", process.env.NODE_ENV, "mode on port", PORT)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
