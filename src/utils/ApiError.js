class ApiError extends Error {
  constructor(message= "Something went wrong",
    statusCode,
    errors=[],
    stack=""

  ){
    super(message);
    this.statusCode = statusCode;
    this.data = Null;
    this.errors = errors;
    this.message = message;
    this.success = false;

    if (stack) {
        this.stack = stack;
        }
    else {
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;