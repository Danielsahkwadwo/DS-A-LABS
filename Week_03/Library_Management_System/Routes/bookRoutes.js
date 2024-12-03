const express = require("express");
const router = express.Router();
const { protect, adminRoleAuth } = require("../Middlewares/authMiddleware");
const { addNewBook, modifyBook, deleteBook } = require("../Controllers/booksController");

router.use(protect, adminRoleAuth);
//add book
router.post("/create-book", addNewBook);
router.patch("/edit-book/:id", modifyBook);
router.delete("/delete-book/:id", deleteBook);
//edit book
//delete book
//view all transactions
//generate reports
module.exports = router;
