class ApiError extends Error {
  constructor(message = "Something went wrong", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  } 
}

module.exports = ApiError;