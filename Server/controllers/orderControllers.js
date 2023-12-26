// Imports
const Order = require("../models/orderModel");
const errorHandler = require("../utils/ErrorHandler");
const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const { updateStock } = require("../utils/updateStock");
// -----------------------------------------------------------------------------------------------------------
// Controllers
// Controllers - Create New Order
const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});
// -----------------------------------------------------------------------------------------------------------
// Controllers - Get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order)
    return next(
      new errorHandler(`Order Not Found with id: ${req.params.id}`, 404)
    );
  res.status(200).json({
    success: true,
    order,
  });
});
// -----------------------------------------------------------------------------------------------------------
// Controllers - Get All Orders of Logged In User
const getAllOrdersOfLoggedInUser = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders)
    return next(
      new errorHandler(`No Orders Found with user: ${req.user._id}`, 404)
    );
  res.status(200).json({
    success: true,
    orders,
  });
});
// -----------------------------------------------------------------------------------------------------------
// Controllers - Get All Orders - Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  // Find the Sum of Amount of All the Orders
  let totalOrdersAmount = 0;
  orders.forEach((order) => {
    totalOrdersAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalOrdersAmount,
    orders,
  });
});
// -----------------------------------------------------------------------------------------------------------
// Controllers - Update Order Status,Stock & Delivered Time - Admin
const updateOrderStatusAndStock = catchAsyncErrors(async (req, res, next) => {
  // Find Order
  const order = await Order.findById(req.params.id);
  if (!order)
    return next(
      new errorHandler(`Order Does Not Found With Id :${req.params.id}`, 404)
    );
  if (order.orderStatus === "delivered")
    return next(
      new errorHandler(`Order Already Delivered With Id :${req.params.id}`, 400)
    );
  // Update Stock
  if (req.body.orderStatus === "shipped") {
    order.orderItems.forEach(async (orderItem) => {
      await updateStock(orderItem.product, orderItem.quantity); // Edited From productId to product
    });
  }
  // Update the OrderStatus Manually
  order.orderStatus = req.body.orderStatus;
  // Update Delivered Time
  if (req.body.orderStatus === "delivered") order.deliveredAt = Date.now();
  // Save Order
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    // order,
  });
});
// -----------------------------------------------------------------------------------------------------------
// Controllers - Delete Order - Admin
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return next(
      new errorHandler(`Order Does Not Found With Id :${req.params.id}`, 404)
    );
  await order.deleteOne();
  res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
// -----------------------------------------------------------------------------------------------------------

module.exports = {
  newOrder,
  getSingleOrder,
  getAllOrdersOfLoggedInUser,
  getAllOrders,
  updateOrderStatusAndStock,
  deleteOrder,
};
