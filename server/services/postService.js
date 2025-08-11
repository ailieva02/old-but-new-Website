const connection = require("../dbConn");
const ResponseModel = require("../models/responseModel");
const PostModel = require("../models/postModel");
const userService = require("../services/userService");
const categoryService = require("../services/categoryService");
const { response } = require("express");

const createPost = (postModel, currentUserId, currentUserRole) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    // Validate authorization
    if (!currentUserId || !currentUserRole) {
      response.success = false;
      response.status = 400;
      response.message = "Current user data is required";
      return reject(response);
    }

    // Restrict to own userId or admin
    if (currentUserRole !== "admin" && currentUserId !== postModel.userId) {
      response.success = false;
      response.status = 403;
      response.message = "Unauthorized: You can only create posts for yourself";
      return reject(response);
    }

    try {
      // Validate user existence
      const existingUserResult = await userService.getUserById(postModel.userId, currentUserId, currentUserRole);
      if (!existingUserResult.success || !existingUserResult.data || existingUserResult.data.length === 0) {
        response.success = false;
        response.status = 404;
        response.message = `No user was found for this user id: ${postModel.userId}`;
        return reject(response);
      }

      // Validate category existence
      const existingCategoryResult = await categoryService.getCategoryById(postModel.categoryId);
      if (!existingCategoryResult.success || !existingCategoryResult.data || existingCategoryResult.data.length === 0) {
        response.success = false;
        response.status = 404;
        response.message = `No category was found for this category id: ${postModel.categoryId}`;
        return reject(response);
      }

      // Check for duplicate post title in category
      const existingPostResult = await getPostByCategoryIdAndTitle(postModel.categoryId, postModel.title);
      if (existingPostResult.success && existingPostResult.data && existingPostResult.data.length > 0) {
        response.success = false;
        response.status = 409;
        response.message = `The Title: ${postModel.title} is already being used for this category, please choose another!`;
        return reject(response);
      }

      // Insert post
      const query = `
        INSERT INTO Post (categoryId, userId, title, body, image, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const dateTimeNow = new Date().toISOString().slice(0, 19).replace("T", " ");
      const values = [
        postModel.categoryId,
        postModel.userId,
        postModel.title,
        postModel.body,
        postModel.image ? `${postModel.image}` : null,
        dateTimeNow,
      ];

      connection.query(query, values, (error, results) => {
        if (error) {
          response.success = false;
          response.status = 500;
          response.message = `Error creating post: ${error.message}`;
          return reject(response);
        }

        response.status = 201;
        response.success = true;
        response.message = "Post created successfully";
        response.data = { id: results.insertId };
        resolve(response);
      });
    } catch (error) {
      console.error('Service - Error:', error.stack);
      response.success = false;
      response.status = error.status || 500;
      response.message = error.message || "Internal server error";
      reject(response);
    }
  });
};

const updatePost = (PostModel) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    // Validate the new category
    const categoryCheck = await categoryService.getCategoryById(PostModel.categoryId);
    if (!categoryCheck.success || categoryCheck.data.length === 0) {
      response.success = false;
      response.message = `Category with id ${PostModel.categoryId} does not exist.`;
      response.status = 404;
      return reject(response);
    }

    // Ensure title uniqueness in the new category
    const titleConflict = await getPostByCategoryIdAndTitle(PostModel.categoryId, PostModel.title);
    if (titleConflict.data && titleConflict.data.some(post => post.id !== PostModel.id)) {
      response.success = false;
      response.message = `The title "${PostModel.title}" is already used in this category.`;
      response.status = 409;
      return reject(response);
    }
    
if (!PostModel.id || !PostModel.categoryId || !PostModel.userId) {
  response.success = false;
  response.message = "Missing required fields for update.";
  return reject(response);
}

    // Update query (no need to update image, as it remains the same unless provided)
    const query = `UPDATE Post 
                   SET categoryId = ?, title = ?, body = ? 
                   WHERE id = ? AND userId = ?`;

    // Use PostModel.userId from the post itself (instead of session user ID)
    connection.query(
      query,
      [PostModel.categoryId, PostModel.title, PostModel.body, PostModel.id, PostModel.userId],
      (error, results) => {
        if (error) {
          response.success = false;
          response.message = `Error querying the database: ${error}`;
          return reject(response);
        }

        // Check if any rows were updated
        if (results.affectedRows === 0) {
          response.success = false;
          response.message = "No post was updated. Please check the post ID or your permissions.";
          return reject(response);
        }

        response.status = 200;
        response.success = true;
        response.message = "Post updated successfully.";
        resolve(response);
      }
    );
  }).catch((error) => {
    if (error instanceof ResponseModel) return error;

    const response = new ResponseModel();
    response.message = error;
    response.success = false;
    return response;
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

    const query = "SELECT * FROM Post WHERE id = ?";

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

const getPostByCategoryIdAndTitle = (categoryId, title) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `SELECT * FROM Post 
                        WHERE categoryId = ? 
                        AND title = ?`;

    connection.query(query, [categoryId, title], (error, results) => {
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

const getPostsByCategoryId = (categoryId) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM Post WHERE categoryId = ?";

    connection.query(query, [categoryId], (error, results) => {
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

const getPostsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM Post WHERE userId = ?";

    connection.query(query, [userId], (error, results) => {
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
