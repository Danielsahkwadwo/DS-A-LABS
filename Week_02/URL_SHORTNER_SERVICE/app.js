const express = require("express");
const app = express();
const path = require("path");
const { body, validationResult } = require("express-validator");

app.use(express.urlencoded({ extended: true }));

//loading pug template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//declaring a map to hold the created URLs
const urlMap = new Map();

//route for homepage
app.get("/", (req, res) => {
  res.status(200).render("index", {
    title: "URL Shortener",
    data: urlMap,
  });
});

//route for error page
app.get("/error", (req, res) => {
  res.status(200).render("error");
});

//route for url shortening
app.post("/shorten", [body("url").isURL()], (req, res) => {
  const error = validationResult(req);
  let newUrl;
  if (error && !error.isEmpty()) {
    return res.send(error.errors[0]["msg"]);
  } else {
    //generate random 6-character code;
    const randomCharacter = Math.random().toString(36).slice(2, 8);
    newUrl = `${randomCharacter}.ly`;
    urlMap.set(newUrl, req.body.url);
  }
  res.redirect("/");
});

//route for redirecting
app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;
  if (urlMap.has(shortCode)) {
    res.redirect(`${urlMap.get(shortCode)}`);
  } else {
    res.redirect("/error");
  }
});

module.exports = app;
