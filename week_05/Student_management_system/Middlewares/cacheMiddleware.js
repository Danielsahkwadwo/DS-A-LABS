const mergeSort = require("../helpers/mergeSort");
const AppError = require("../Utils/AppError");
const { RedisClient } = require("./../config/redis");

const cacheMiddleware = (keyPrefix, ttl = 3600) => {
  return async (req, res, next) => {
    try {
      let { sortBy } = req.query;
      let { order } = req.query;
      if (!sortBy) return next(new AppError("Please provide a sort criteria", 400));
      if (order && order !== "asc" && order !== "desc")
        return next(new AppError("Please provide a valid order. either asc or desc", 400));

      // Check if sort starts with "-" for descending order
      if (sortBy.startsWith("-")) {
        order = "desc";
        sortBy = sortBy.slice(1);
      }
      const key = `${keyPrefix}:${JSON.stringify(req.params) || ""}`;

      // Check if data is already in Redis
      const cachedData = await RedisClient.get(key);

      if (cachedData) {
        const data = JSON.parse(cachedData).data;
        const sortedCourses = mergeSort(data, sortBy, order);
        console.log("Cache hit");
        return res.json({
          status: "success",
          fields: sortBy,
          order: order ?? "asc",
          data: sortedCourses,
        });
      }

      console.log("Cache miss");

      // Overwrite res.send to cache the response data
      const originalSend = res.json.bind(res);

      res.json = async (data) => {
        await RedisClient.setEx(key, ttl, JSON.stringify(data));
        originalSend(data);
      };

      next();
    } catch (err) {
      console.error("Redis Error:", err);
      next(); // Proceed even if there's a Redis error
    }
  };
};

module.exports = cacheMiddleware;
