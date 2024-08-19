const connection = require("../dbConn");
const ResponseModel = require("../models/responseModel");
const PostModel = require("../models/postModel");
const userService = require("../services/userService");
const categoryService = require("../services/categoryService");
const { response } = require("express");

const createPost = (PostModel) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    const existingUserResult = await userService.getUserById(PostModel.user_id);
    if (
      existingUserResult &&
      existingUserResult.data &&
      existingUserResult.data.length > 0
    ) {
      const existingCategoryResult = await categoryService.getCategoryById(
        PostModel.category_id
      );
      if (
        existingCategoryResult &&
        existingCategoryResult.data &&
        existingCategoryResult.data.length > 0
      ) {
        const existingPostResult = await getPostByCategoryIdAndTitle(
          PostModel.category_id,
          PostModel.title
        );
        if (existingPostResult) {
          if (existingPostResult.data && existingPostResult.data.length > 0) {
            response.message = `The Title: ${PostModel.title} is already being used for this category, please choose another!`;
            response.status = 409;
            response.success = false;

            reject(response);
          } else {
            const query = `INSERT INTO Post (category_id, user_id, title, body, image, created_at) 
                                        VALUES(?, ?, ?, ?, ?, ?)`;

            const dateTimeNow = new Date();
            const formattedDateTimeNow = dateTimeNow
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");

            connection.query(
              query,
              [
                PostModel.category_id,
                PostModel.user_id,
                PostModel.title,
                PostModel.body,
                PostModel.image,
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
          }
        }
      } else {
        response.message = `No category was found for this category id: ${PostModel.category_id}!`;
        response.status = 409;
        response.success = false;

        reject(response);
      }
    } else {
      response.message = `No user was found for this user id: ${PostModel.user_id}!`;
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

const updatePost = (PostModel) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    const query = `UPDATE Post 
                        SET title = ?, body = ?, image = ?
                        WHERE id = ?`;

    connection.query(
      query,
      [PostModel.title, PostModel.body, PostModel.image, PostModel.id],
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

const deletePostById = (id) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    const query = `DELETE FROM Post 
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

const deleteAllPosts = () => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    connection.query(`DELETE FROM Post`, (error, results) => {
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

const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    connection.query("SELECT * FROM Post", (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;

        if (results.length === 0) {
          response.message = "No posts were found!";
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

const getPostById = (id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM post WHERE id = ?";

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
          response.message = "No post was found!";
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

const getPostByCategoryIdAndTitle = (category_id, title) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `SELECT * FROM post 
                        WHERE category_id = ? 
                        AND title = ?`;

    connection.query(query, [category_id, title], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;
        if (results.length === 0) {
          response.message = `No post was found with this title: ${title}, for this category!`;
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

const getPostsByCategoryId = (category_id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM post WHERE category_id = ?";

    connection.query(query, [category_id], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;

        if (results.length === 0) {
          response.message = "No posts were found for this category!";
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

const getPostsByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM post WHERE user_id = ?";

    connection.query(query, [user_id], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;

        if (results.length === 0) {
          response.message = "No posts were found for this user!";
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

module.exports = {
  createPost,
  updatePost,
  deletePostById,
  deleteAllPosts,
  getAllPosts,
  getPostById,
  getPostByCategoryIdAndTitle,
  getPostsByCategoryId,
  getPostsByUserId,
};
