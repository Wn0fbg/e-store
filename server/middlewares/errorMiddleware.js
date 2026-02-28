class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorModdleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const message = `Duplicate field value entered:`;
    err = new ErrorHandler(message, 400);
  }

  if ((err.name = "JsonWebTokenError")) {
    const message = "Json Web Token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }
};

export default ErrorHandler;
