// Imports
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, changePassword, changeProfileNameOrEmailOrAvatar, getAllUsers, getSingleUser, changeUserRole, deleteUser, } = require('../controllers/userControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

// Routes - User
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:generatedResetPasswordToken').put(resetPassword)
router.route('/me').get(isAuthenticatedUser, getUserDetails)
router.route('/password/update').put(isAuthenticatedUser, changePassword)
router.route('/me/update').put(isAuthenticatedUser, changeProfileNameOrEmailOrAvatar)
// Routes - Admin
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers)
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), changeUserRole)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

module.exports = router;