const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "product name is required"],
    },
    categoryID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "category",
    },
    userID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    description: {
      type: String,
    },
    imagePath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;
