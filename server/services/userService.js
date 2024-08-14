const connection = require("../dbConn");
const ResponseModel = require("../models/responseModel");
const UserModel = require("../models/userModel");

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    connection.query("SELECT * FROM User", (error, results) => {
      if (error) {
        response.status = 500;
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;

        resolve(response);
      }
    });
  });
};

const getUserById = (id) => {};

const createUser = (UserModel) => {};

const updateUser = (UserModel) => {};

const deleteUserById = (id) => {};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
};
