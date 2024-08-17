const connection = require("../dbConn");
const argon2 = require("argon2");
const ResponseModel = require("../models/responseModel");
const UserModel = require("../models/userModel");
const { response } = require("express");

const createUser = (UserModel) => {
  const response = new ResponseModel();

  return new Promise(async (resolve, reject) => {
    const result = await getUserByEmail(UserModel.email);
    if (result) {
      if (result.data && result.data.length > 0) {
        response.message = `Email: ${UserModel.email} is already being used, please choose another!`;
        response.status = 409;
        response.success = false;

        reject(response);
      } else {
        const query = `INSERT INTO User (name, lastname, username, password, email, role) 
                                VALUES(?, ?, ?, ?, ?, ?)`;

        const hashedPassword = await argon2.hash(UserModel.password);

        connection.query(
          query,
          [
            UserModel.name,
            UserModel.lastname,
            UserModel.username,
            hashedPassword,
            UserModel.email,
            UserModel.role,
          ],
          (error, results) => {
            if (error) {
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
      }
    } else {
      response.success = false;
      response.message = "Something went wrong!";
      reject(response);
    }
  }).catch((error) => {
    response.message = JSON.stringify(error);
    response.success = false;
    return response;
  });
};

const authenticateUser = async (email, password) => {
  const response = new ResponseModel();
  return new Promise(async (resolve, reject) => {
    const result = await getUserByEmail(email);

    if (!result || !result.data || result.data.length === 0) {
      response.status = 401;
      response.message =
        "Invalid credentials! check your inputs and try again.";
      response.success = false;

      reject(response);
    } else {
      const user = result.data[0];
      const isMatch = await argon2.verify(user.password, password);

      if (!isMatch) {
        response.status = 401;
        response.message =
          "Invalid credentials! check your inputs and try again.";
        response.success = false;

        reject(response);
      }

      response.status = 200;
      response.success = true;
      response.data = {
        id: user.id,
        role: user.role,
      };

      resolve(response);
    }
  }).catch((error) => {
    response.message = JSON.stringify(error);
    response.success = false;
    return response;
  });
};

const updateUser = (UserModel) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    const query = `UPDATE User 
                       SET name = ?, lastname = ?, username = ?, password = ?, email = ?, role = ?
                       WHERE id = ?`;

    const hashedPassword = await argon2.hash(UserModel.password);

    connection.query(
      query,
      [
        UserModel.name,
        UserModel.lastname,
        UserModel.username,
        hashedPassword,
        UserModel.email,
        UserModel.role,
        UserModel.id,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
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

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    connection.query("SELECT * FROM User", (error, results) => {
      if (error) {
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

const deleteUserById = (id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `DELETE FROM Users 
                       WHERE id = ?`;

    connection.query(query, [id], (error, results) => {
      if (error) {
        console.log(error);
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

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM User WHERE email = ? LIMIT 1";

    connection.query(query, [email], (error, results) => {
      if (error) {
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

module.exports = {
  authenticateUser,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
};
