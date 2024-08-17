const express = require('express');
const postController = require('../controllers/postController');
const router = express.Router();

router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.get('/posts-by-category-id', postController.getPostsByCategoryId);
router.get('/posts-by-category-id-and-title', postController.getPostByCategoryIdAndTitle);
router.get('/posts-by-user-id', postController.getPostsByUserId);
router.post('/posts/delete', postController.deletePostById);
router.post('/posts/delete-all', postController.deleteAllPosts);
router.post('/posts/create', postController.createPost);
router.post('/posts/update', postController.updatePost);

module.exports = router;