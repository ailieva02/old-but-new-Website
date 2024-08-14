const ResponseModel = require('../models/responseModel');
const UserModel = require('../models/userModel');
const userService = require('../services/userService');

// TODO: add verification

const getAllUsers = async (req, res) => {
    const result = await userService.getAllUsers();
    if (result) {
        res.status(result.status).json(result);
    } else {
        res.status(500).json("Something went wrong");    
    }
};

const getUser = (req, res) => {
    const response = new ResponseModel();

    const userId = parseInt(req.params.id);
    const result = userService.getUserById(userId);
    
    if (result) {
        response.success = true;
        response.data = result;
        res.status(200).json(response);
    } else {
        response.success = false;
        response.message = 'User not found!';
        res.status(404).json(response);
    }
};

const createUser = (req, res) => {
    const response = new ResponseModel();
    const newUser = new UserModel();

    newUser.name = req.params.name;
    newUser.lastname = req.params.lastname;
    newUser.username = req.params.username;
    newUser.email = req.params.email;
    newUser.password = req.params.password;
    newUser.role = req.params.role;
    
    const result = userService.createUser(newUser);
    if (result) {
        response.success = true;
        response.message = 'Successfully created user!';
        res.status(200).json(response);
    } else {
        res.status(404).json({ success: false, message: 'Something went wrong, could not create user!' });
    }
};

const updateUser = (req, res) => {
    const response = new ResponseModel();

    const userId = parseInt(req.params.id);
    const user = userService.getUserById(userId);

    if (user) {
        user.name = req.params.name;
        user.lastname = req.params.lastname;
        user.username = req.params.username;
        user.email = req.params.email;
        user.password = req.params.password;
        user.role = req.params.role;

        const result = userService.updateUser(user);
        if (result) {
            response.success = true;
            response.message = 'Successfully updated user!';
            res.status(200).json(response);
        } else {
            response.success = false;
            response.message = 'Something went wrong, could not update user!';
            res.status(500).json(response);
        }
    } else {
        response.success = false;
        response.message = 'Could not find user!';
        res.status(404).json(response);
    }
}

const deleteUser = (req, res) => {
    const response = new ResponseModel();
    const userId = parseInt(req.params.id);
    const result = userService.deleteUserById(userId);

    if (result) {
        response.success = true;
        response.message = 'User successfully deleted!';
        res.status(200).json(response);
    } else {
        response.success = false;
        response.message = 'Something went wrong, could not delete user or user does not exist!';
        res.status(500).json(response);
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};