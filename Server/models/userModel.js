const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot Exceed 30 Characters"],
    minLength: [4, "Name Cannot Be Less Than 4 Characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Tour Email"],
    unique: true,
    validate: [validator.isEmail, "PLease Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password Must Not Be Less Than 8 Characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Password Hashing Using bcrypt.hash Method
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Generate JWT Token using jwt.sign Method
userSchema.methods.generateJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match Password - User Login Using bcrypt.compare Method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating & Hashing Reset Password Token
userSchema.methods.generateResetPasswordToken = function () {
  const generatedResetPasswordToken = crypto.randomBytes(20).toString("hex"); // Generating  Reset Password Token
  // Hashing Reset Password Token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(generatedResetPasswordToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // Reset Password Token Expiry Time
  return generatedResetPasswordToken;
};

module.exports = mongoose.model("User", userSchema);
