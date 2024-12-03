const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "root",
  database: "library_management",
});

module.exports = db;
