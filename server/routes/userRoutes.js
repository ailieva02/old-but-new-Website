const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUser);
router.post('/users/create', userController.createUser);
router.post('/users/update', userController.updateUser);
router.post('/users/delete', userController.deleteUser);

module.exports = router;