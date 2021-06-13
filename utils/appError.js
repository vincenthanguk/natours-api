class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // already sets message property

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // when a new object is created and the constructor function is called, that function will not appear in the stack trace and will not pollute it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
