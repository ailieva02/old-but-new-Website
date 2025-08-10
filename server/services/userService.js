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
      response.message = "Invalid credentials! check your inputs and try again.";
      response.success = false;

      reject(response);
    } else {
      const user = result.data[0];
      const isMatch = await argon2.verify(user.password, password);

      if (!isMatch) {
        response.status = 401;
        response.message = "Invalid credentials! check your inputs and try again.";
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

const updateUser = (UserModel, currentUserId, currentUserRole) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    // Authorization check
    if (!currentUserId || !currentUserRole) {
      response.success = false;
      response.status = 400;
      response.message = 'Current user data is required';
      return reject(response);
    }

    if (currentUserRole !== 'admin' && parseInt(currentUserId) !== parseInt(UserModel.id)) {
      response.success = false;
      response.status = 403;
      response.message = 'Unauthorized: You can only update your own account';
      return reject(response);
    }

    // Check if email is already used by another user
    const emailCheck = await getUserByEmail(UserModel.email);
    if (emailCheck && emailCheck.data && emailCheck.data.length > 0) {
      const existingUser = emailCheck.data[0];
      if (parseInt(existingUser.id) !== parseInt(UserModel.id)) {
        response.success = false;
        response.status = 409;
        response.message = `Email: ${UserModel.email} is already being used by another user, please choose another!`;
        return reject(response);
      }
    }

    let query = `UPDATE User 
                 SET name = ?, lastname = ?, username = ?, email = ?, role = ?
                 WHERE id = ?`;
    let params = [
      UserModel.name,
      UserModel.lastname,
      UserModel.username,
      UserModel.email,
      UserModel.role,
      UserModel.id,
    ];

    if (UserModel.password && typeof UserModel.password === 'string' && UserModel.password.trim()) {
      try {
        const hashedPassword = await argon2.hash(UserModel.password);
        query = `UPDATE User 
                 SET name = ?, lastname = ?, username = ?, password = ?, email = ?, role = ?
                 WHERE id = ?`;
        params = [
          UserModel.name,
          UserModel.lastname,
          UserModel.username,
          hashedPassword,
          UserModel.email,
          UserModel.role,
          UserModel.id,
        ];
      } catch (error) {
        response.success = false;
        response.message = `Error hashing password: ${error.message}`;
        return reject(response);
      }
    }

    connection.query(query, params, (error, results) => {
      if (error) {
        console.error('Database error:', error);
        response.success = false;
        response.message = `Error querying the database: ${error.message}`;
        return reject(response);
      }

      if (results.affectedRows === 0) {
        response.success = false;
        response.status = 404;
        response.message = 'User not found';
        return reject(response);
      }

      response.status = 200;
      response.success = true;
      resolve(response);
    });
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

const getUserById = (userId, currentUserId, currentUserRole) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();
    console.log("this is the response: ", response);

    if (!currentUserId || !currentUserRole) {
      response.success = false;
      response.status = 400;
      response.message = 'Current user data is required';
      return reject(response);
    }

    if (currentUserRole !== 'admin' && currentUserId !== userId) {
      response.success = false;
      response.status = 403;
      response.message = 'Unauthorized: You can only access your own data';
      return reject(response);
    }

    const query = "SELECT * FROM User WHERE id = ?";

    connection.query(query, [userId], (error, results) => {
      if (error) {
        response.success = false;
        response.status = 500;
        response.message = `Error querying the database: ${error}`;
        return reject(response);
      }

      response.status = 200;
      response.success = true;
      response.data = results;
      if (results.length === 0) {
        response.message = "No user was found!";
      }

      resolve(response);
    });
  });
};

const deleteUserById = (userIdToDelete, currentUserId, currentUserRole) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    if (!currentUserId || !currentUserRole) {
      response.success = false;
      response.status = 400;
      response.message = 'Current user data is required';
      return reject(response);
    }

    if (currentUserRole !== 'admin' && currentUserId !== userIdToDelete) {
      response.success = false;
      response.status = 403;
      response.message = 'Unauthorized: You can only delete your own account';
      return reject(response);
    }

    const query = `DELETE FROM User WHERE id = ?`;

    connection.query(query, [userIdToDelete], (error, results) => {
      if (error) {
        response.success = false;
        response.status = 500;
        response.message = `Error querying the database: ${error}`;
        return reject(response);
      }

      if (results.affectedRows === 0) {
        response.success = false;
        response.status = 404;
        response.message = 'User not found';
        return reject(response);
      }

      response.status = 200;
      response.success = true;
      resolve(response);
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
          response.message = "No User was found!";
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
