// Imports
const express = require("express");
const router = express.Router();
const {
  newOrder,
  getSingleOrder,
  getAllOrdersOfLoggedInUser,
  getAllOrders,
  updateOrderStatusAndStock,
  deleteOrder,
} = require("../controllers/orderControllers");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Routes - User
router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/orders/me").get(isAuthenticatedUser, getAllOrdersOfLoggedInUser);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
// Routes - Admin
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatusAndStock)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
