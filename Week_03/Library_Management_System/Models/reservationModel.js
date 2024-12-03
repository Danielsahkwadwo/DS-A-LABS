const db = require("./database");

const createReservationTable = async () => {
  const reservationQuery = `CREATE TABLE IF NOT EXISTS reservation(
    reservationId INT AUTO_INCREMENT PRIMARY KEY,
    bookId INT NOT NULL,
    userId INT NOT NULL,
    reservationDate DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  db.query(reservationQuery)
    .then((result) => {
      console.log("reservation table created");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = createReservationTable;
