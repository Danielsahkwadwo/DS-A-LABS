const express = require("express");
const dotenv = require("dotenv");
const globalErrorHandler = require("./Utils/globalErrorHandler");
dotenv.config({ path: ".env" });
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();

//routes
const studentRoutes = require("./Routes/students");
const courseRoutes = require("./Routes/courses");
const enrolmentRoutes = require("./Routes/enrolment");
const instructorRoutes = require("./Routes/Instructor");

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("welcome to the server");
});

app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrolment", enrolmentRoutes);
app.use("/api/v1/instructor", instructorRoutes);

//database connection
mongoose
  .connect(process.env.LOCAL_DB)
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT ?? 3000, () => {
      console.log("server started on port 3000");
    });
  })
  .catch((err) => console.log(err.message));

//using global error handler middleware
app.use(globalErrorHandler);
