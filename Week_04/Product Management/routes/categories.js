const express = require("express");
const { addCategory, getCategories } = require("../controllers/categories");
const { protect } = require("../middlewares/authMiddlewares");
const router = express.Router();

router.post("/add", protect, addCategory);
router.get("/allCategories",getCategories);
module.exports = router;
