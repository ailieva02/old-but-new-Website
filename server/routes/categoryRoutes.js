const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.get('/categories-by-title', categoryController.getCategoryByTitle);
router.get('/categories-by-user-id', categoryController.getCategoriesByUserId);
router.post('/categories/create', categoryController.createCategory);
router.post('/categories/update', categoryController.updateCategory);
router.post('/categories/delete', categoryController.deleteCategoryByCategoryId);

module.exports = router;