const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductByQuery,
} = require("../controllers/products");
const { protect, isAdmin } = require("../middlewares/authMiddlewares");
const uploadImage = require("../utils/multerConfig");
const router = express.Router();

router.get("/groupByCategories", getProductsByCategory);
router.get("/getByQuery", getProductByQuery);

router.use(protect, isAdmin);
router.post("/add", uploadImage, addProduct);
router.post("/modifyProduct/:id", uploadImage, updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

module.exports = router;
