import Product from "../models/productModel.js";

// Get All Products
const getAllProducts = async () => {
  return await Product.find();
};

// Get Product By ID
const getProductById = async (id) => {
  return await Product.findById(id);
};

// Create Product
const createProduct = async (productData) => {
  return await Product.create(productData);
};

// Update Product
const updateProduct = async (id, productData) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

// Delete Product
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
