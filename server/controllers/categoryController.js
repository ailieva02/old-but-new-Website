const CategoryModel = require("../models/categoryModel");
const categoryService = require("../services/categoryService");

const createCategory = async (req, res) => {
  const newCategory = new CategoryModel();

  newCategory.user_id = req.body.user_id;
  newCategory.title = req.body.title;

  const result = await categoryService.createCategory(newCategory);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong");
  }
};

const updateCategory = async (req, res) => {
  const categoryId = parseInt(req.body.id);
  const categoryToUpdate = await categoryService.getCategoryById(categoryId);

  categoryToUpdate.id = categoryId;
  categoryToUpdate.title = req.body.title;

  const result = await categoryService.updateCategory(categoryToUpdate);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong");
  }
};

const deleteCategoryByCategoryId = async (req, res) => {
  const categoryId = parseInt(req.body.id);
  const result = await categoryService.deleteCategoryByCategoryId(categoryId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong");
  }
};

const getAllCategories = async (req, res) => {
  const result = await categoryService.getAllCategories();
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong");
  }
};

const getCategoriesByUserId = async (req, res) => {
  const userId = parseInt(req.body.id);

  const result = await categoryService.getCategoriesByUserId(userId);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong");
  }
};

const getCategoryByTitle = async (req, res) => {
  const title = req.body.title;
  const result = await categoryService.getCategoryByTitle(title);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong");
  }
};

const getCategoryById = async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const result = await categoryService.getCategoryById(categoryId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong");
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategoryByCategoryId,
  getAllCategories,
  getCategoriesByUserId,
  getCategoryByTitle,
  getCategoryById,
};
