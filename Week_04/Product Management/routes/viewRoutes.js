const express = require("express");
const {
  renderHome,
  renderProducts,
  renderLogin,
  renderRegisterPage,
  renderDashboard,
  renderAddProduct,
  renderAddCategory,
  renderAllProducts,
  renderEditProduct,
} = require("../controllers/viewControllers");
const { protect } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.get("/", renderHome);
router.get("/products", renderProducts);
router.get("/login", renderLogin);
router.get("/register", renderRegisterPage);

router.get("/dashboard/profile", protect, renderDashboard);
router.get("/dashboard/add-product", protect, renderAddProduct);
router.get("/dashboard/add-category", protect, renderAddCategory);
router.get("/dashboard/products", protect, renderAllProducts);
router.get("/updateProduct/:id", protect, renderEditProduct);

module.exports = router;
