const Product = require("./../models/products");
const fs = require("fs");
const path = require("path");

exports.addProduct = async (req, res, next) => {
  try {
    const { productName, price, quantity, description, categoryID } = req.body;
    if (!productName || !price || !quantity || !description || !categoryID)
      throw new Error("all fields are required");
    if (!req.file) throw new Error("product image not uploaded");

    const newProduct = await Product.create({
      ...req.body,
      userID: req.user._id,
      imagePath: req.file.filename,
    });
    if (!newProduct)
      throw new Error("an error occurred while creating product");
    res.redirect("/dashboard/products");
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    console.log("route used");
    const { productName, price, quantity, description, categoryID } = req.body;
    if (!productName || !price || !quantity || !description || !categoryID)
      throw new Error("all fields are required");

    let newImagePath;
    if (req.file) {
      newImagePath = req.file.filename;
    } else {
      newImagePath = req.body.imagePath;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        imagePath: newImagePath,
      },
      { new: true, runValidators: true }
    );
    if (!product) throw new Error("product not found");
    res.redirect("/dashboard/products");
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productToDelete = await Product.findById(req.params.id);
    if (!productToDelete) throw new Error("product not found");
    //delete product image from disk
    if (productToDelete.imagePath) {
      await fs.unlink(
        path.join(
          __dirname,
          "..",
          `/${productToDelete.imagePath.replace("\\", "/")}`
        ),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
    //delete product after deleting image
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new Error("product not found");
    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("categoryID")
      .sort("-createdAt");
    if (!products) throw new Error("an error occurred while getting products");
    return products;
  } catch (error) {
    next(error);
  }
};

// exports.getSingleProduct = async (req, res, next) => {
//   try {
//     console.log(req);
//     // const product = await Product.findById(id).populate("categoryID");
//     // if (!product) throw new Error("product not found");
//     const product = "here";
//     console.log(product);
//     return product;
//   } catch (error) {
//     next(error);
//   }
// };

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      {
        // Stage 1: Perform a lookup to join the products with categories
        $lookup: {
          from: "categories", // The name of the collection to join with
          localField: "categoryID", // Field in the products collection
          foreignField: "_id", // Field in the categories collection
          as: "category", // Output array field
        },
      },
      {
        // Stage 2: Unwind the category array to de-nest the lookup result
        $unwind: "$category",
      },
      {
        // Stage 3: Group by categoryID and categoryName, and collect the products
        $group: {
          _id: {
            categoryID: "$categoryID",
            categoryName: "$category.categoryName",
          },
          products: {
            $push: {
              productName: "$productName",
              price: "$price",
              quantity: "$quantity",
              description: "$description",
              imagePath: "$imagePath",
            },
          },
        },
      },
      {
        // Stage 4: Project the desired fields for output
        $project: {
          _id: 0,
          categoryID: "$_id.categoryID",
          categoryName: "$_id.categoryName",
          products: 1,
        },
      },
    ]);

    if (!products) throw new Error("an error occurred while getting products");
    // res.status(200).render("products", { products });
    // res.status(200).json({ status: "success", products });
    return products;
  } catch (error) {
    next(error);
  }
};

exports.searchProduct = async (req, res, next) => {
  try {
    const products = await Product.find({
      productName: req.params.productName,
    });
    if (!products) throw new Error("an error occurred while getting products");
    res.status(200).render("products", { products });
  } catch (error) {
    next(error);
  }
};
