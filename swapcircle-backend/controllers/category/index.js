const Category = require("../../models/datavalidation/category");
const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Items = require("../../models/datavalidation/item");

//create category
const createcategory = async (req, res, next) => {
  try {
    const { category, status } = req.body;

    const newCategory = new Category({
      category: category,
      status: status,
    });

    await newCategory.save();
    res.status(200).json({
      status: true,
      message: "Category inserted successfully",
      category: newCategory,
    });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view category
const viewcategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: true,
      message: "Data fetched successfully!",
      result: categories,
    });
    return categories;
  } catch (error) {
    console.log(error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view specific category
const viewspeceficcategory = async (req, res) => {
  const categoryId = req.params.id;

  // Validate categoryId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid category ID format" });
  }

  try {
    const categories = await Category.findById(categoryId);
    if (!categories) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }
    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      result: categories,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//update category
const updatecategory = async (req, res) => {
  const categoryId = req.params.id;
  const updateData = req.body;

  // Validate categoryId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid Category ID format" });
  }
  try {
    const updatecategories = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatecategories) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }
    res.status(200).json({
      status: true,
      message: "Data updated successfully",
      updatecategories,
    });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal sever error" });
  }
};

//delete category
const deletecategory = async (req, res) => {
  let categoryId = req.params.id;

  // Validate categoryId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid category ID format" });
  }
  try {
    const deletecategory = await Category.findByIdAndDelete(categoryId);
    if (!deletecategory) {
      return null;
    }
    res
      .status(200)
      .json({ status: true, message: "Category deleted successfully" });
    return deletecategory;
  } catch (error) {
    console.log("Error; ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//update category status
const updatecategorystatus = async (req, res) => {
  const categoryId = req.params.id;
  const { status } = req.body;

  // Validate categoryId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid Category ID format" });
  }
  try {

    const updatecategories = await Category.findByIdAndUpdate(
      categoryId,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updatecategories) {
      return res
        .status(404)
        .json({ status: false, message: "Category not found" });
    }

    if (updatecategories?.status) {
      res.status(200).json({
        status: true,
        message: "Category Disabled",
        updatecategories,
      });
    } else {
      res.status(200).json({
        status: true,
        message: "Category Enabled",
        updatecategories,
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal sever error" });
  }
};

//similar products category
const similarcategoryproduct = async (req, res, next) => {
  const { categoryId, itemId } = req.query;
  const { keywords } = req.body;

  // Input validation
  if (!categoryId) {
    return res
      .status(400)
      .json({ status: false, message: "Category ID is required." });
  }
  if (!itemId) {
    return res
      .status(400)
      .json({ status: false, message: "Item ID is required." });
  }

  try {
    // Create regex from keywords (e.g., "sofa set" => /(sofa|set)/i)
    const regex = keywords
      ? new RegExp(keywords.split(" ").join("|"), "i")
      : null;

    const query = {
      category_id: categoryId,
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
      _id: { $ne: itemId },
    };

    if (regex) {
      query.name = regex; // Add regex search to the query if keywords exist
    }

    const result = await Items.find(query)
      .populate("user_id", "average_rating")
      .exec();

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Items not found" });
    }

    // Sort the results based on user average_rating
    const sortedResult = result.sort(
      (a, b) => b.user_id.average_rating - a.user_id.average_rating
    );

    res.status(200).json({
      status: true,
      message: "Data fetched successfully!",
      result: sortedResult,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(Error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createcategory,
  viewcategory,
  viewspeceficcategory,
  updatecategory,
  deletecategory,
  updatecategorystatus,
  similarcategoryproduct,
};
