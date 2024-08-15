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
        if (results.length === 0) {
          response.message = "No users were found!";
        }

        resolve(response);
      }
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM User WHERE id = ?";

    connection.query(query, [id], (error, results) => {
      if (error) {
        response.status = 500;
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;
        if (results.length === 0) {
          response.message = "No user was found!";
        }

        resolve(response);
      }
    });
  });
};

const createUser = (UserModel) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `INSERT INTO User (name, lastname, username, password, email, role) 
                       VALUES(?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [
        UserModel.name,
        UserModel.lastname,
        UserModel.username,
        UserModel.password,
        UserModel.email,
        UserModel.role,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
          response.status = 500;
          response.success = false;
          response.message = `Error querying the database: ${error}`;

          reject(response);
        } else {
          response.status = 200;
          response.success = true;

          resolve(response);
        }
      }
    );
  });
};

const updateUser = (UserModel) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `UPDATE User 
                       SET name = ?, lastname = ?, username = ?, password = ?, email = ?, role = ?
                       WHERE id = ?`;

    connection.query(
      query,
      [
        UserModel.name,
        UserModel.lastname,
        UserModel.username,
        UserModel.password,
        UserModel.email,
        UserModel.role,
        UserModel.id,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
          response.status = 500;
          response.success = false;
          response.message = `Error querying the database: ${error}`;

          reject(response);
        } else {
          response.status = 200;
          response.success = true;

          resolve(response);
        }
      }
    );
  });
};

const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `DELETE FROM User 
                       WHERE id = ?`;

    connection.query(query, [id], (error, results) => {
      if (error) {
        console.log(error);
        response.status = 500;
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;

        resolve(response);
      }
    });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
};
