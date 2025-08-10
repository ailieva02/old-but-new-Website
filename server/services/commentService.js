const connection = require("../dbConn");
const ResponseModel = require("../models/responseModel");
const CommentModel = require("../models/commentModel");
const postService = require("../services/postService");
const userService = require("../services/userService");
const { response } = require("express");

const getAllComments = () => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    connection.query("SELECT * FROM Comment", (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;

        if (results.length === 0) {
          response.message = "No comments were found!";
        }

        resolve(response);
      }
    });
  }).catch((error) => {
    if (error instanceof ResponseModel) {
      return error;
    } else {
      const response = new ResponseModel();
      response.message = error;
      response.success = false;
      return response;
    }
  });
};

const getAllCommentsByPostId = (postId) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();
    const query = "SELECT * FROM Comment WHERE postId = ?";

    connection.query(query, [postId], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;
        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;
        if (results.length === 0) {
          response.message = "No comments found!";
        }
        resolve(response);
      }
    });
  });
};

const getCommentById = (id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM Comment WHERE id = ?";

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
          response.message = "No comment was found!";
        }

        resolve(response);
      }
    });
  }).catch((error) => {
    if (error instanceof ResponseModel) {
      return error;
    } else {
      const response = new ResponseModel();
      response.message = error;
      response.success = false;
      return response;
    }
  });
};

const deleteCommentById = async (id, currentUserId, currentUserRole, commentUserId) => {
  try {
    return await new Promise(async (resolve, reject) => {
      const response = new ResponseModel();

      if (!currentUserId || !currentUserRole) {
        response.success = false;
        response.status = 400;
        response.message = 'Current user data is required';
        reject(response);
        return;
      }

      if (currentUserRole !== 'admin' && currentUserId !== commentUserId) {
        response.success = false;
        response.status = 403;
        response.message = 'Unauthorized: You can only access your own data';
        reject(response);
        return;
      }

      const query = `DELETE FROM Comment 
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
  } catch (error) {
    if (error instanceof ResponseModel) {
      return error;
    } else {
      const response = new ResponseModel();
      response.message = error;
      response.success = false;
      return response;
    }
  }
};

const deleteAllComments = () => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    connection.query(`DELETE FROM Comment`, (error, results) => {
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
  }).catch((error) => {
    if (error instanceof ResponseModel) {
      return error;
    } else {
      const response = new ResponseModel();
      response.message = error;
      response.success = false;
      return response;
    }
  });
};

const createComment = (CommentModel) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    const existingPostResult = await postService.getPostById(
      CommentModel.postId
    );
    if (
      existingPostResult &&
      existingPostResult.data &&
      existingPostResult.data.length > 0
    ) {
      const existingUserResult = await userService.getUserById(
        CommentModel.currentUserId, CommentModel.currentUserId, CommentModel.currentUserRole
      );

      if (
        existingUserResult &&
        existingUserResult.data &&
        existingUserResult.data.length > 0
      ) {
        const query = `INSERT INTO Comment (postId, userId, body, public, createdAt) 
                                VALUES(?, ?, ?, ?, ?)`;

        const dateTimeNow = new Date();
        const formattedDateTimeNow = dateTimeNow
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        connection.query(
          query,
          [
            CommentModel.postId,
            CommentModel.userId,
            CommentModel.body,
            CommentModel.public,
            formattedDateTimeNow,
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
      } else {
        response.message = `No user was found for this user id: ${CommentModel.userId}!`;
        response.status = 409;
        response.success = false;

        reject(response);
      }
    } else {
      response.message = `No post was found for this post id: ${CommentModel.postId}!`;
      response.status = 409;
      response.success = false;

      reject(response);
    }
  }).catch((error) => {
    if (error instanceof ResponseModel) {
      return error;
    } else {
      const response = new ResponseModel();
      response.message = error;
      response.success = false;
      return response;
    }
  });
};

const updateComment = async (CommentModel) => {
  try {
    const response = new ResponseModel();

    if (!CommentModel.currentUserId || !CommentModel.currentUserRole) {
      response.success = false;
      response.status = 400;
      response.message = 'Current user data is required';
      throw response;
    }


    if (CommentModel.currentUserRole !== 'admin' && CommentModel.currentUserId !== CommentModel.commentUserId) {
      response.success = false;
      response.status = 403;
      response.message = 'Unauthorized: You can only access your own data';
      throw response;
    }

    const query = `UPDATE Comment 
                        SET body = ?, public = ?
                        WHERE id = ?`;

    return await new Promise((resolve, reject) => {
      connection.query(
        query,
        [CommentModel.body, CommentModel.public, CommentModel.id],
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
  } catch (error) {
    if (error instanceof ResponseModel) {
      return error;
    } else {
      const response = new ResponseModel();
      response.message = error.message || error;
      response.success = false;
      return response;
    }
  }
};

module.exports = {
  getAllComments,
  getAllCommentsByPostId,
  getCommentById,
  deleteCommentById,
  deleteAllComments,
  createComment,
  updateComment,
};
