// Imports
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/ApiFeatures");
const cloudinary = require("cloudinary");
// ------------------------------------------------------------------------------------------------------------
// Controllers
// Controllers - Create Product - Admin Only
const createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; // Store the User Id of the User that Created the Product - Automatically

  let images = [];
  for (let i = 0; i < req.body.imagesLength; i++)
    images.push(req.body[`image${i}`]);

  const imagesLinks = [];
  if (images !== undefined)
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  req.body.images = imagesLinks;
  req.body.user = req.user._id;

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controllers - Get All Product
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultsPerPage = 4; // For Pagination
  const productsCount = await Product.countDocuments(); // Count Documents for FrontEnd
  const apiFeaturesDemo = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeaturesDemo.query;
  let filteredProductsCount = products.length;
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);
  products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultsPerPage,
    filteredProductsCount,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controllers - Get All Product(Admin)
const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controllers - Get Single Product
const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controllers - Update Product - Admin Only
const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id); // Get Product
  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  // Update Images Here
  let images = [];
  for (let i = 0; i < req.body.imagesLength; i++)
    images.push(req.body[`image${i}`]);

  if (images !== undefined) {
    // Destroy Previous Images
    for (let i = 0; i < product.images.length; i++)
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    const imagesLinks = [];
    // Upload New Images
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLinks;
  }
  // Get Product & Update with req.body
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controllers - Delete Product - Admin Only
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Create or Update Reviews, Ratings & Number of Reviews
const CreateOrUpdateProductReviewAndRatings = catchAsyncErrors(
  async (req, res, next) => {
    const { rating, comment, productId } = req.body; // Get Variable Values with Object Destructuring
    const review = {
      // Create Review Object
      userId: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    const product = await Product.findById(productId); // Find Product
    if (!product)
      return next(
        new ErrorHandler(
          `Product Does Not Exist with Id : ${req.params.id}`,
          404
        )
      );
    // Check if product is Already Reviewed by the User - Find Index
    const productIsReviewedAlreadyIndex = product.reviews.findIndex(
      (review) => {
        return review.userId.toString() === req.user._id.toString();
      }
    );
    // If Already Reviewed - Update the Existing Review Other Create a New Review
    if (productIsReviewedAlreadyIndex !== -1) {
      product.reviews[productIsReviewedAlreadyIndex].rating = rating;
      product.reviews[productIsReviewedAlreadyIndex].comment = comment;
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length; // Number of Reviews = Reviews.length
    }
    // Finding Average Rating of Product Based on Multiple Reviews
    let sumOfRatings = 0;
    product.reviews.forEach((review) => {
      sumOfRatings += review.rating;
    });
    product.ratings = sumOfRatings / product.reviews.length;
    // Save Product Review
    await product.save();
    res.status(200).json({
      success: true,
      message: "Reviewed Successfully",
    });
  }
);
// ------------------------------------------------------------------------------------------------------------
// Controller - Get All Reviews of A Product
const getAllReviewsOfProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product)
    return next(
      new ErrorHandler(`Product Does Not Exist with Id : ${req.query.id}`, 404)
    );
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
// ------------------------------------------------------------------------------------------------------------
// Controller - Delete Review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
  // Find Product With req.query.productId
  const product = await Product.findById(req.query.productId);
  if (!product)
    return next(
      new ErrorHandler(
        `Product Does Not Exist with Id : ${req.query.productId}`,
        404
      )
    );
  // Filter product Reviews and Save into a Reviews Variable
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  // Finding Updated Average Rating of Product
  let sumOfRatings = 0;
  reviews.forEach((review) => {
    sumOfRatings += review.rating;
  });
  let ratings = 0;
  if (reviews.length === 0) ratings = 0;
  else ratings = sumOfRatings / reviews.length;
  // Finding Updated Number Of Reviews
  const numOfReviews = reviews.length;
  // Save Product Details
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
// ------------------------------------------------------------------------------------------------------------

module.exports = {
  createProduct,
  getAllProducts,
  getAdminProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  CreateOrUpdateProductReviewAndRatings,
  getAllReviewsOfProduct,
  deleteReview,
};
