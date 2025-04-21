function errorHandler(err, req, res, next) {
  // log it for internal debugging
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

module.exports = errorHandler;
