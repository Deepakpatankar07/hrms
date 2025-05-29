class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }

    this.name = 'ErrorResponse';
    this.date = new Date();
  }

  toJSON() {
    return {
      success: false,
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      date: this.date
    };
  }
}

module.exports = ErrorResponse;