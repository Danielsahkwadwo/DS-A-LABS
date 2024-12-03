const db = require("./database");

const createUserTable = async () => {
  const userQuery = `CREATE TABLE IF NOT EXISTS users(
        userId INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(255) NOT NULL,
        role enum('admin', 'user') default 'user',
        password VARCHAR(255) NOT NULL,
        borrowed_books INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  db.query(userQuery)
    .then((result) => {
      console.log("user table created");
    })
    .catch((err) => {
      console.log(err);
    });
};

const createNewUser = async function (
  name,
  email,
  phone,
  role,
  password,
  borrowed_books
) {
  const userQuery = `INSERT INTO users(name, email, phone, role, password,borrowed_books) VALUES(?, ?, ?, ?, ?, ?)`;
  const values = [name, email, phone, role, password, borrowed_books];
  const userRow = await db.query(userQuery, values);
  return userRow;
};

const getAllUsers = async () => {
  const rows = await db.query(`SELECT * FROM users`);
  return rows[0];
};

const getUserById = async (userId) => {
  const rows = await db.query(`SELECT * FROM users WHERE userId = ?`, [userId]);
  return rows[0];
};

const updateUser = async (userId, name, phone, role, borrowed_books) => {
  const userQuery = `UPDATE users SET name = ?,  phone = ?, role = ?, borrowed_books = ? WHERE userId = ?`;
  const values = [name, phone, role, borrowed_books, userId];
  const userRow = await db.query(userQuery, values);
  return userRow[0];
};

const deleteUser = async function (userId) {
  const userQuery = `DELETE FROM users WHERE userId = ?`;
  const values = [userId];
  const userRow = await db.query(userQuery, values);
  return userRow[0];
};

const login = async function (email, password) {
  const userQuery = `SELECT * FROM users WHERE email = ?`;
  const value = [email];
  const userRow = await db.query(userQuery, value);
  return userRow[0];
};

const borrowBook = async function (userId, bookId) {
  const userQuery = `UPDATE users SET borrowed_books = borrowed_books + 1 WHERE userId = ?`;
  const values = [userId];
  const userRow = await db.query(userQuery, values);
  return userRow[0];
};

const returnBook = async function (userId, bookId) {
  const userQuery = `UPDATE users SET borrowed_books = borrowed_books - 1 WHERE userId = ?`;
  const values = [userId];
  const userRow = await db.query(userQuery, values);
  return userRow[0];
};

module.exports = {
  createUserTable,
  createNewUser,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  borrowBook,
};
