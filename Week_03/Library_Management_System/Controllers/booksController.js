const {
  addBook,
  getAllBooks,
  getBookById,
  getBookByTitle,
  editBook,
  deleteBook,
} = require("../Models/bookModel");

exports.addNewBook = async (req, res, next) => {
  try {
    const {
      title,
      genreID,
      author,
      publisher,
      yearPublished,
      copies,
      description,
    } = req.body;
    if (
      !title ||
      !genreID ||
      !author ||
      !publisher ||
      !yearPublished ||
      !copies ||
      !description
    ) {
      throw new Error("All fields are required");
    }
    const result = await addBook(
      title,
      genreID,
      author,
      publisher,
      yearPublished,
      copies,
      description
    );
    if (!result) throw new Error("an error occurred while adding book");
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const result = await getAllBooks();
    if (!result) throw new Error("an error occurred");
    res
      .status(200)
      .render("dashboard", { books: result.reverse() });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.browseBooks = async (req, res, next) => {
  try {
    const result = await getAllBooks();
    if (!result) throw new Error("an error occurred");
    res.status(200).render("books", { books: result.reverse() });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getBook = async (req, res, next) => {
  try {
    const result = await getBookById(req.params.id);
    if (result.length === 0) throw new Error("book not found");

    res.status(200).render("editBook", { book: result[0] });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.modifyBook = async (req, res, next) => {
  try {
    const {
      title,
      genreID,
      author,
      publisher,
      yearPublished,
      copies,
      description,
    } = req.body;
    const bookId = req.params.id;
    if (
      !title ||
      !genreID ||
      !author ||
      !publisher ||
      !yearPublished ||
      !copies ||
      !description
    ) {
      throw new Error("All fields are required");
    }
    const result = await editBook(
      title,
      genreID,
      author,
      publisher,
      yearPublished,
      copies,
      description,
      bookId
    );
    if (result && result.affectedRows === 0)
      throw new Error("an error occurred while modifying book");
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.searchBookByTitle = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) throw new Error("please enter a title");

    const result = await getBookByTitle(title);
    if (!result) throw new Error("book not found");

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const result = await deleteBook(bookId);
    if (result && result.affectedRows === 0)
      throw new Error("an error occurred while modifying book");
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400);
    next();
  }
};
