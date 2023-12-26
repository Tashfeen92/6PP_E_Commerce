const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

// Authentication For User Login - Check For Correct jwtToken
const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const jwtToken = req.cookies.jwtToken; // Get jwtToken From Cookies
  if (!jwtToken)
    return next(new ErrorHandler("Please Login to Access this Resource", 401));
  // Verify our jwtToken Using jwt.verify Method - jwt.verify return three properties id, created At & Expiry
  const verifiedJWTToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
  if (!verifiedJWTToken)
    return next(new ErrorHandler("Invalid Token, Please Login Again", 401));
  req.user = await User.findById(verifiedJWTToken.id);
  next();
});

// Check For User Login Role - Admin Or User - Accepting Arguments as Rest Operator into an Array
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ErrorHandler(
          `Role:${req.user.role} it not allowed to access this Resource`,
          403
        )
      );
    next();
  };
};

module.exports = { isAuthenticatedUser, authorizeRoles };
