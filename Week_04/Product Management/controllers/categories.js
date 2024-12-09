const Category = require("./../models/categories");

exports.addCategory = async (req, res, next) => {
  try {
    const { categoryName, description } = req.body;
    if (!categoryName || !description)
      throw new Error("all fields are required");
    const newCategory = await Category.create({
      categoryName: categoryName.toLowerCase(),
      description: description,
    });
    if (!newCategory)
      throw new Error("an error occurred while creating category");
    res.redirect("/dashboard/add-category");
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (!categories)
      throw new Error("an error occurred while getting categories");
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};
