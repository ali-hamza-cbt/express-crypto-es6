import express from "express";
import { body } from "express-validator";
import validate from "../../middlewares/validateMiddleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/api/productController.js";

// Common validation rules
const productValidationRules = [
  body("name").notEmpty().withMessage("Product name is required."),
  body("price").isNumeric().withMessage("Price must be a number."),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a positive integer."),
  body("image")
    .optional()
    .custom((value, { req }) => {
      if (req.file) {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
        ];
        if (!allowedTypes.includes(req.file.mimetype)) {
          throw new Error("Only JPEG, PNG, JPG, and WEBP images are allowed.");
        }
      }
      return true;
    }),
];

// Routes
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", upload("products").single("image"), validate(productValidationRules), addProduct);
router.put("/:id", upload("products").single("image"), validate(productValidationRules), updateProduct);
router.delete("/:id", deleteProduct);

export default router; // ✅ Use `export default`
