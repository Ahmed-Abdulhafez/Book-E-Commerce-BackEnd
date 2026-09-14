const categoryModel = require("../models/category.schema.cjs");

// GET ALL category
exports.getAllCategory = async (req, res) => {
  try {
    const category = await categoryModel.find();
    return res
      .status(200)
      .json({ message: "category retrieved successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Category By Id
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }
    return res
      .status(200)
      .json({ message: "category retrieved successfully", data: category });
  } catch (error) {
    console.log("Error getting category:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    res.status(500).json({ message: "Server Error" });
  }
};

// Create new Category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required!" });
    }
    const newCategory = new categoryModel({ name });
    const savedCategory = await newCategory.save();
    return res.status(201).json({
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists!" });
    }
    console.log("Error creating category:", error);
    return res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = categoryModel.findByIdAndUpdate(
      id,
      { name: name },
      { returnDocument: "after" },
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found!" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.log("Error updating category:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Category
exports.deletedCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "category not found!" });
    }
    await categoryModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log("Error deleting category:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
