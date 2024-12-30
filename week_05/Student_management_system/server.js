const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerUI = require("swagger-ui-express");
const Specs = require("./swagger");
const logger = require("./config/logger");
const globalErrorHandler = require("./Middlewares/globalErrorHandler");
const connectDatabase = require("./config/database");
const {RedisConnect} = require("./config/redis");

const app = express();

//routes
const studentRoutes = require("./Routes/students");
const courseRoutes = require("./Routes/courses");
const enrolmentRoutes = require("./Routes/enrolment");
const instructorRoutes = require("./Routes/Instructor");

//configurations
connectDatabase();
RedisConnect();

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

app.listen(process.env.PORT ?? 3000, () => {
  console.log(`server started on port ${process.env.PORT}`);
});

module.exports = app;