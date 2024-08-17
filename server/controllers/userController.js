const UserModel = require('../models/userModel');
const userService = require('../services/userService');

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const result = await userService.authenticateUser(email, password);
    if (result) {
        res.status(result.status).json(result);
    } else {
        res.status(500).json("Something went wrong");    
    }
}

const getAllUsers = async (req, res) => {
    const result = await userService.getAllUsers();
    if (result) {
        res.status(result.status).json(result);
    } else {
        res.status(500).json("Something went wrong");    
    }
};

const getUser = async (req, res) => {
    const userId = parseInt(req.params.id);
    const result = await userService.getUserById(userId);
    
    if (result) {
        res.status(result.status).json(result);
    } else {
        res.status(500).json("Something went wrong");    
    }
};

const createUser = async (req, res) => {
    const newUser = new UserModel();

    newUser.name = req.body.name;
    newUser.lastname = req.body.lastname;
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    newUser.role = req.body.role;
    
    const result = await userService.createUser(newUser);
    if (result) {
        res.status(result.status).json(result);
    } else {
        res.status(500).json("Something went wrong");    
    }
};

const updateUser = async (req, res) => {
    const userId = parseInt(req.body.id);
    const userToUpdate = await userService.getUserById(userId);

    userToUpdate.id = userId;
    userToUpdate.name = req.body.name;
    userToUpdate.lastname = req.body.lastname;
    userToUpdate.username = req.body.username;
    userToUpdate.email = req.body.email;
    userToUpdate.password = req.body.password;
    userToUpdate.role = req.body.role;
    
    const result = await userService.updateUser(userToUpdate);
    if (result) {
        res.status(result.status).json(result);
    } else {
        res.status(500).json("Something went wrong");    
    }
}

const deleteUser = async (req, res) => {
    const userId = parseInt(req.body.id);
    const result = await userService.deleteUserById(userId);

    if (result) {
        res.status(result.status).json(result);
    } else {
        res.status(500).json("Something went wrong");    
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