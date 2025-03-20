import productService from "../../services/productService.js";

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, message: "Products retrieved successfully", data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product retrieved successfully", data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create Product
export const addProduct = async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const image = req.file ? `/images/products/${req.file.filename}` : null;

    const productData = { name, quantity, price, image };
    const product = await productService.createProduct(productData);

    res.status(201).json({ success: true, message: "Product created successfully", data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, quantity, price, status } = req.body;
    const image = req.file ? `/images/products/${req.file.filename}` : undefined;

    const updateData = { name, quantity, price, status };
    if (image) updateData.image = image;

    const product = await productService.updateProduct(req.params.id, updateData);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export default { getProducts, getProduct, addProduct, updateProduct, deleteProduct};
