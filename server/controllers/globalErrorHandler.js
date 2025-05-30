// middleware/globalErrorHandler.js
module.exports = (err, req, res, next) => {
  console.error('💥 Error:', err);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status,
    message: err.message || 'Something went wrong!',
  });
};
