
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String, 
  description: String,
  is_deleted:{ type:Boolean , default:false }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;