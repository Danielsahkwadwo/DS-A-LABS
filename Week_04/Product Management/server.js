const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const viewRoutes = require("./routes/viewRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const { getCategories } = require("./controllers/categories");

const app = express();
dotenv.config({ path: ".env" });

//database connection
mongoose
  .connect(process.env.LOCAL_DB)
  .then(() => {
    console.log("Database connected");
    //starting express server
    app.listen(process.env.PORT ?? 4000, () => {
      console.log("server started on port 3000");
    });
  })
  .catch((err) => console.log(err.message));

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

//configuring session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("public"));

app.use("/", viewRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

app.get("*", (req, res) => {
  res.status(404).render("error");
});

//global error handler middleware
app.use(globalErrorHandler);
