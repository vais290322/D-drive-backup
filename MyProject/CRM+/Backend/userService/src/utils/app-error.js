const {StatusCodes} = require('http-status-codes');

class AppError extends Error{
  constructor(
    name= 'AppError',
    message='An unexpected error occurred',
    description = "Something went wrong",
    statusCode= StatusCodes.INTERNAL_SERVER_ERROR,
  )
  {
    super(message);
    this.name = name;
    this.message = message;
    this.description = description;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;