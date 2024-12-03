const app = require("./app");
const userModel = require("./Models/userModel");
const createGenreModel = require("./Models/genre");
const createReservationModel = require("./Models/reservationModel");
const createTransactionModel = require("./Models/transactionModel");
const { createBookTable } = require("./Models/bookModel");

//create tables
userModel.createUserTable();
createBookTable();
createGenreModel();
createReservationModel();
createTransactionModel();

//start server
const server = app.listen(process.env.PORT, () => {
  console.log(`server connected on port ${process.env.PORT}`);
});
