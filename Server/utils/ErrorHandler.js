class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Preserve information about the location in your code where the error was thrown. 
        // This is often done to provide more detailed information about where the error occurred in your code when you throw and catch custom errors.
        Error.captureStackTrace(this, this.constructor)
    }
}
module.exports = ErrorHandler