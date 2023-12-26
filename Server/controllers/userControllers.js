// Imports
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const { jwtToken } = require("../utils/jwtToken");
const { sendEmail } = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
// ------------------------------------------------------------------------------------------------------------
// Controller
// Controller - Register User
const registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  jwtToken(user, 201, res); // Create Login jwtToken
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Login User
const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Kindly Enter Valid Credentials", 401));
  const user = await User.findOne({ email }).select("+password"); // Also Select Password For Our Founded User
  if (!user)
    return next(new ErrorHandler("Kindly Enter Valid Credentials", 401));
  const isPasswordMatched = await user.comparePassword(password); // Match Password using bcrypt.compare Method
  if (!isPasswordMatched)
    return next(new ErrorHandler("Kindly Enter Valid Credentials", 401));
  jwtToken(user, 200, res); // Create Login jwtToken
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Logout User
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwtToken", null, {
    // Set jwtToken Cookie Value to Null
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Forgot Password User
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Get User Details
  const user = await User.findOne({ email: req.body.email });
  if (!user) next(new ErrorHandler("User Not Found", 404));
  // Generating & Hashing Reset Password Token Using crypto.randomBytes Method
  const generatedResetPasswordToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Reset Password Email Content That Should be Sent to a User - Use When Hosting a WebSite (If Not Working try /api/v1 before /password/reset/)
  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/password/reset/${generatedResetPasswordToken}`;

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${generatedResetPasswordToken}`;
  const message = `Your Password Reset Token Url is:- \n\n${resetPasswordUrl} \n\nIf you have not requested it, Kindly Ignore it.`;
  // Send Email To User
  try {
    // Must Use App Password in Gmail For the Email where you want to Send Emails
    await sendEmail({
      email: user.email,
      subject: "E-commerce Password Reset Token",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email Sent to ${user.email} Successfully`,
    });
  } catch (error) {
    // If Any Error While Sending an Email
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(new ErrorHandler(error, 500));
  }
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Reset Password User
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Creating token Hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.generatedResetPasswordToken)
    .digest("hex");
  // Get User Details Using Reset Password Token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user)
    return next(
      new ErrorHandler("Reset Password Token is Invalid or Expired", 400)
    );
  if (req.body.password !== req.body.confirmPassword)
    return next(new ErrorHandler("Password Does Not Matched", 400));
  // Save New Credentials to the User details
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.save();
  jwtToken(user, 200, res); // Create Login jwtToken
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Get User Details
const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Change Password - User
const changePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // Check the Correctness of the Old Password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Old Password is Incorrect", 400));
  if (req.body.newPassword !== req.body.confirmPassword)
    return next(new ErrorHandler("Passwords Does Not Match", 400));
  if (req.body.oldPassword === req.body.newPassword)
    return next(new ErrorHandler("You Must Change the Password", 400));
  // Saving the Password to user Details
  user.password = req.body.newPassword;
  await user.save();
  jwtToken(user, 200, res); // Create Login jwtToken
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Change Profile Name or Email or Avatar - User
const changeProfileNameOrEmailOrAvatar = catchAsyncErrors(
  // Does Not Work If New Avatar is not uploaded
  async (req, res, next) => {
    const usersNewData = {
      // Create Object For User New Data Since There are More than One Field
      name: req.body.name,
      email: req.body.email,
    };
    // Change Avatar - Cloudinary For Avatar
    if (req.body.avatar !== "undefined") {
      const user = await User.findById(req.user.id);
      const imageId = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      usersNewData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    // Find User And Update User Data
    const user = await User.findByIdAndUpdate(req.user.id, usersNewData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      user,
    });
  }
);
// ------------------------------------------------------------------------------------------------------------
// Controller - Get All Users Details - Admin
const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Get Single User Details - Admin
const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(`User Does Not Exist with Id : ${req.params.id}`, 404)
    );
  res.status(200).json({
    success: true,
    user,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Change User Role - Admin
const changeUserRole = catchAsyncErrors(async (req, res, next) => {
  const usersNewData = {
    // Create Object For User New Data Since There are More than One Field
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, usersNewData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  if (!user)
    return next(
      new ErrorHandler(`User Does Not Exist with Id : ${req.params.id}`, 404)
    );
  res.status(200).json({
    success: true,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Delete User - Admin
const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(`User Does Not Exist with Id : ${req.params.id}`, 404)
    );

  // Will Remove Cloudinary Later For Avatar
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
// ------------------------------------------------------------------------------------------------------------

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  changePassword,
  changeProfileNameOrEmailOrAvatar,
  getAllUsers,
  getSingleUser,
  changeUserRole,
  deleteUser,
};
