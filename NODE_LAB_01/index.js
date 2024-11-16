const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const pathName = req.url;
  const homePage = path.join(__dirname, "home.html");
  const usersPage = path.join(__dirname, "users.html");

  if (pathName === "/") {
    res.writeHead(200, ("Content-Type", "text/html"));
    fs.readFile(homePage, "utf-8", (err, data) => {
      if (err) {
        console.log("there was an error laoding file");
      } else {
        res.end(data);
      }
    });
  } else if (pathName === "/users") {
    res.writeHead(200, ("Content-Type", "text/html"));
    fs.readFile(usersPage, "utf-8", (err, data) => {
      if (err) {
        console.log("There was an error loading file");
      } else {
        res.end(data);
      }
    });
  } else if (pathName === "/create-user") {
    res.writeHead(200, ("Content-Type", "text/plain"));
    console.log(res)
    res.end("hello");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
