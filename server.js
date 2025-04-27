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

// Swagger setup
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

// Swagger config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'SE Project API',
      version: '1.0.0',
      description: 'API documentation for SE project',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',  
      },
    ],
  },
  apis: ['./routes/*.js'], 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// rate limiting
const request = 200;
const limiter = rateLimit({
  windowsMs: 60 * 1000,
  max: request,
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
