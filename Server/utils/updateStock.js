const Product = require('../models/productModel')

const updateStock = async (productId, quantity) => {
    const product = await Product.findById(productId)
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false })
}
    
module.exports = { updateStock }