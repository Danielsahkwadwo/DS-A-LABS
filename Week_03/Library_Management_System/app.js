const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes");
const bookRoutes = require("./Routes/bookRoutes");
const transactionRoutes = require("./Routes/transactionRoutes");
const globalErrorHandler = require("./Middlewares/globalErrorHandler");
const {
  getBooks,
  getBook,
  browseBooks,
  getBookDetails,
} = require("./Controllers/booksController");
const { protect } = require("./Middlewares/authMiddleware");
const { allTransactions } = require("./Controllers/transactionController");

dotenv.config({ path: ".env" });

app.use(express.json());
app.use(cookieParser());

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.render("main", { title: "Library Management System" })
);
app.get("/books", protect, browseBooks);
app.get("/dashboard", protect, getBooks);
app.get("/edit-book/:id", getBook);
app.get("/book/:id", getBookDetails);
app.get("/transactions", protect, allTransactions);
app.get("/add-book", protect, (req, res) => res.render("addBook"));
app.get("/add-user", protect, (req, res) => res.render("addUser"));
app.get("/login", (req, res) => res.render("login"));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.use("*", (req, res) => res.status(404).json({ error: "Route not found" }));

app.use(globalErrorHandler);
module.exports = app;
