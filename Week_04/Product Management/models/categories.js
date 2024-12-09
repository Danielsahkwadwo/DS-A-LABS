const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      unique: [true, "category name must be unique"],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
