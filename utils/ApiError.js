class ApiError extends Error {
  constructor (statusCode, message, responseObject = {}) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.response = responseObject;
  }
}


module.exports = ApiError;
