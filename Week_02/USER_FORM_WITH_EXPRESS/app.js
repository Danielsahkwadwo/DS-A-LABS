const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));

const homeFile = path.join(__dirname, "/public/index.html");
const usersFile = path.join(__dirname, "/public/users.html");
app.get("/", (req, res) => {
  res.sendFile(homeFile);
});

app.get("/users", (req, res) => {
  res.sendFile(usersFile);
});

app.post("/create-user", (req, res) => {
  console.log(req.body.username);
  setTimeout(() => {
    res.redirect("/");
  }, 1000);
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(401).send("Oops! an error occurred");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
