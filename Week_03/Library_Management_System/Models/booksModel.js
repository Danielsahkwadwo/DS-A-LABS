const db = require ("./database");

const booksModel = async function () {
    const booksQuery = `
                CREATE TABLE IF NOT EXISTS books(
                        id INT NOT NULL AUTO_INCREMENT,
                        title VARCHAR(255) NOT NULL,
                        author VARCHAR(255) NOT NULL,
                        description VARCHAR(255) NOT NULL,
                        PRIMARY KEY(id),
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`;

    await db
        .query(booksQuery)
        .then((res) => {
            console.log("books table created");
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = booksModel