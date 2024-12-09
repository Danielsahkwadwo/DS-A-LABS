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
const router = express.Router();

router.get("/", renderHome);
router.get("/products", renderProducts);
router.get("/login", renderLogin);
router.get("/register", renderRegisterPage);
router.get("/dashboard/profile", renderDashboard);
router.get("/dashboard/add-product", renderAddProduct);
router.get("/dashboard/add-category", renderAddCategory);
router.get("/dashboard/products", renderAllProducts);
router.get("/updateProduct/:id", renderEditProduct);

module.exports = router;
