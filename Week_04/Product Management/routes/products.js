const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/products");
const { protect } = require("../middlewares/authMiddlewares");
const uploadImage = require("../utils/multerConfig");
const router = express.Router();

router.post("/add", protect, uploadImage, addProduct);
router.post("/modifyProduct/:id", protect, uploadImage, updateProduct);
router.delete("/deleteProduct/:id", protect, deleteProduct);
router.get("/groupByCategories",getProductsByCategory)

module.exports = router;
