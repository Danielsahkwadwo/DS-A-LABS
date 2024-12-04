const { decreaseBookCopies, setAvailable } = require("../Models/bookModel");
const { borrowBook } = require("../Models/userModel");
const transactionModel = require("./../Models/transactionModel");

exports.createTransaction = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;
    const borrowDate = new Date(Date.now());
    const result = await transactionModel.createTransaction(
      bookId,
      userId,
      borrowDate
    );

    if (result[0].affectedRows === 0)
      throw new Error("an error occurred while creating transaction");
    //if transaction is created then update user status and book status
    const userResult = await borrowBook(userId);
    if (userResult.affectedRows === 0)
      throw new Error("an error occurred while updating user status");

    const bookResult = await decreaseBookCopies(bookId);
    if (bookResult.affectedRows === 0)
      throw new Error("an error occurred while updating book status");
    // await setAvailable(bookId);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.allTransactions = async (req, res, next) => {
  try {
    const result = await transactionModel.getAllTransactions();
    if (result.length === 0)
      throw new Error("an error occurred while getting transactions");
    res.status(200).render("transactions", { transactions: result.reverse() });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
