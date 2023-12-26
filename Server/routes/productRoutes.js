// Imports
const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  CreateOrUpdateProductReviewAndRatings,
  getAllReviewsOfProduct,
  deleteReview,
} = require("../controllers/productControllers.js");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/auth.js");

// Routes - User
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getSingleProduct);
router
  .route("/review")
  .put(isAuthenticatedUser, CreateOrUpdateProductReviewAndRatings);
router
  .route("/reviews")
  .get(getAllReviewsOfProduct)
  .delete(isAuthenticatedUser, deleteReview);
// Routes - Admin
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

module.exports = router;
