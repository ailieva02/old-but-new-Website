const UserModel = require('../models/userModel');
const userService = require('../services/userService');

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const result = await userService.authenticateUser(email, password);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error in login:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers();
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const currentUserId = parseInt(req.query.currentUserId);
        const currentUserRole = req.query.currentUserRole;

        const result = await userService.getUserById(userId, currentUserId, currentUserRole);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error in getUser:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = new UserModel();

        newUser.name = req.body.name;
        newUser.lastname = req.body.lastname;
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.role = req.body.role;
        
        const result = await userService.createUser(newUser);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

const updateUser = async (req, res) => {
  try {
    const { id, name, lastname, username, email, role, password, currentUserId, currentUserRole } = req.body;
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing user ID',
      });
    }
    if (!name || !lastname || !username || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }
    if (!currentUserId || !currentUserRole) {
      return res.status(400).json({
        success: false,
        message: 'Current user data is required',
      });
    }

    const userId = parseInt(id);
    const userToUpdate = new UserModel();
    userToUpdate.id = userId;
    userToUpdate.name = name;
    userToUpdate.lastname = lastname;
    userToUpdate.username = username;
    userToUpdate.email = email;
    userToUpdate.password = password;
    userToUpdate.role = role;

    const result = await userService.updateUser(userToUpdate, parseInt(currentUserId), currentUserRole);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Something went wrong',
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = parseInt(req.body.id);
        const currentUserId = parseInt(req.body.currentUserId);
        const currentUserRole = req.body.currentUserRole;

        const result = await userService.deleteUserById(userIdToDelete, currentUserId, currentUserRole);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
}

module.exports = {
    login,
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};