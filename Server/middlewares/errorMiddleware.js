const ErrorHandler = require('../utils/ErrorHandler.js')

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ID Error - Cast Error
    if (err.name === 'CastError') {
        const message = `Record Not Found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    // Mongoose Duplicate Key Error - Duplicate Email Error
    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} : Email Already Registered`
        err = new ErrorHandler(message, 400)
    }

    // Wrong jwtToken Error
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token is Invalid, Please Try Again`
        err = new ErrorHandler(message, 400)
    }

    // jwtToken Expiry Error
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token is Expired, Please Try Again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

module.exports = { errorMiddleware }