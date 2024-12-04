const express = require("express");
const { createTransaction } = require("../Controllers/transactionController");
const { protect } = require("../Middlewares/authMiddleware");
const router = express.Router();

router.post("/create-transaction/:id", protect, createTransaction);

module.exports = router;
