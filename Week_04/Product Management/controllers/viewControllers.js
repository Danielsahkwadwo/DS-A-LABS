const Category = require("./../models/categories");
const Product = require("./../models/products");
const {
  getProducts,
  getSingleProduct,
  getProductsByCategory,
} = require("./products");
exports.renderHome = async (req, res) => {
  const categories = await Category.find();
  res
    .status(200)
    .render("index", { title: "Product Management System", categories });
};

//products page
exports.renderProducts = async (req, res, next) => {
  let products;
  if (Object.keys(req.query).length === 0) {
    products = await getProductsByCategory(req, res, next);
  }
  res.status(200).render("products", { title: "Products", products });
};

//login page
exports.renderLogin = (req, res) => {
  res.status(200).render("login");
};

exports.renderRegisterPage = (req, res) => {
  res.status(200).render("signup");
};

exports.renderDashboard = (req, res) => {
  res.status(200).render("dashboard");
};

exports.renderAddProduct = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).render("addProduct", { categories });
  } catch (error) {
    next(error);
  }
};

exports.renderAddCategory = (req, res) => {
  res.status(200).render("addCategory");
};

exports.renderAllProducts = async (req, res) => {
  const products = await getProducts();
  console.log(products);
  res.status(200).render("allProducts", { products });
};

exports.renderEditProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categories = await Category.find();
    const product = await Product.findById(id).populate("categoryID");
    if (!product) throw new Error("product not found");
    res
      .status(200)
      .render("editProduct", { categories, product, productId: id });
  } catch (error) {
    next(error);
  }

  //   console.log(product);
};
