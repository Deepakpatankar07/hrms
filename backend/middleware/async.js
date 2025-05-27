// Higher-order function to wrap async/await route handlers
const asyncHandler = (fn) => (req, res, next) => {
  // Resolve the returned promise from the route handler
  Promise.resolve(fn(req, res, next))
    // Catch any errors and pass them to Express's error handler
    .catch(next);
};

module.exports = asyncHandler;