const db = require("./database");

const createTransactionTable = async () => {
  const transactionQuery = `CREATE TABLE IF NOT EXISTS transaction(
        transactionId INT AUTO_INCREMENT PRIMARY KEY,
        bookId INT NOT NULL,
        userId INT NOT NULL,
        borrowDate DATE NOT NULL,
        returnDate DATE,
        isReturned BOOLEAN default false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  db.query(transactionQuery)
    .then((result) => {
      console.log("transaction table created");
    })
    .catch((err) => {
      console.log(err);
    });
};

const createTransaction = async (bookId, userId, borrowDate) => {
  const query = `INSERT INTO transaction (bookId, userId, borrowDate) VALUES (?, ?, ?)`;
  const values = [bookId, userId, borrowDate];
  const result = await db.query(query, values);
  return result;
};

const getAllTransactions = async () => {
  const result = await db.query(`SELECT * FROM transaction`);
  return result[0];
};
module.exports = {
  createTransactionTable,
  createTransaction,
  getAllTransactions,
};
