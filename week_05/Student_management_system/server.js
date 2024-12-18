const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerUI = require("swagger-ui-express");
const Specs = require("./swagger");
const logger = require("./Utils/logger");
const globalErrorHandler = require("./Middlewares/globalErrorHandler");

const app = express();

//routes
const studentRoutes = require("./Routes/students");
const courseRoutes = require("./Routes/courses");
const enrolmentRoutes = require("./Routes/enrolment");
const instructorRoutes = require("./Routes/Instructor");

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("welcome to the server");
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(Specs));
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/enrollments", enrolmentRoutes);
app.use("/api/v1/instructors", instructorRoutes);

//using global error handler middleware
app.use(globalErrorHandler);

//database connection
mongoose
  .connect(process.env.LOCAL_DB)
  .then(() => {
    console.log("Database connected");
    // logger.log("info", "Database connected sussessfully");
    app.listen(process.env.PORT ?? 3000, () => {
      console.log(`server started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => logger.log("error", err.message));
