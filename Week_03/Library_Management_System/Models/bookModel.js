const db = require("./database");

exports.createBookTable = async () => {
  const bookQuery = `CREATE TABLE IF NOT EXISTS books(
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
genreID VARCHAR(255) NOT NULL,
author VARCHAR(255) NOT NULL,
publisher VARCHAR(255) NOT NULL,
yearPublished INT NOT NULL,
available BOOLEAN DEFAULT TRUE,
copies INT NOT NULL,
description VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

  db.query(bookQuery)
    .then((result) => {
      console.log("books table created");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addBook = async function (
  title,
  genreID,
  author,
  publisher,
  yearPublished,
  copies,
  description
) {
  const query = `INSERT INTO books (title, genreID, author, publisher, yearPublished, copies, description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    title,
    genreID,
    author,
    publisher,
    yearPublished,
    copies,
    description,
  ];
  const result = await db.query(query, values);
  return result;
};

exports.getAllBooks = async () => {
  const rows = await db.query(`SELECT * FROM books`);
  return rows[0];
};

exports.getBookById = async (bookId) => {
  const rows = await db.query(`SELECT * FROM books WHERE id = ?`, [bookId]);
  return rows[0];
};

exports.getBookByTitle = (title) => {
  const rows = db.query(`SELECT * FROM books WHERE title = ?`, [title]);
  return rows[0];
};

exports.deleteBook = async (bookId) => {
  const rows = await db.query(`DELETE FROM books WHERE id = ?`, [bookId]);
  return rows;
};

exports.editBook = async (
  title,
  genreID,
  author,
  publisher,
  yearPublished,
  copies,
  description,
  bookId
) => {
  const rows = await db.query(
    `UPDATE books SET title = ?, genreID = ?, author = ?, publisher = ?, yearPublished = ?, copies = ?, description = ? WHERE id = ?`,
    [
      title,
      genreID,
      author,
      publisher,
      yearPublished,
      copies,
      description,
      bookId,
    ]
  );
  return rows[0];
};
