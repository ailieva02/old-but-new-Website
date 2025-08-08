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

    // Restrict to own user_id or admin
    if (currentUserRole !== "admin" && currentUserId !== postModel.user_id) {
      response.success = false;
      response.status = 403;
      response.message = "Unauthorized: You can only create posts for yourself";
      return reject(response);
    }

    try {
      // Validate user existence
      const existingUserResult = await userService.getUserById(postModel.user_id, currentUserId, currentUserRole);
      if (!existingUserResult.success || !existingUserResult.data || existingUserResult.data.length === 0) {
        response.success = false;
        response.status = 404;
        response.message = `No user was found for this user id: ${postModel.user_id}`;
        return reject(response);
      }

      // Validate category existence
      const existingCategoryResult = await categoryService.getCategoryById(postModel.category_id);
      if (!existingCategoryResult.success || !existingCategoryResult.data || existingCategoryResult.data.length === 0) {
        response.success = false;
        response.status = 404;
        response.message = `No category was found for this category id: ${postModel.category_id}`;
        return reject(response);
      }

      // Check for duplicate post title in category
      const existingPostResult = await getPostByCategoryIdAndTitle(postModel.category_id, postModel.title);
      if (existingPostResult.success && existingPostResult.data && existingPostResult.data.length > 0) {
        response.success = false;
        response.status = 409;
        response.message = `The Title: ${postModel.title} is already being used for this category, please choose another!`;
        return reject(response);
      }

      // Insert post
      const query = `
        INSERT INTO Post (category_id, user_id, title, body, image, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const dateTimeNow = new Date().toISOString().slice(0, 19).replace("T", " ");
      const values = [
        postModel.category_id,
        postModel.user_id,
        postModel.title,
        postModel.body,
        postModel.image ? `/uploads/${postModel.image}` : null,
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
    const categoryCheck = await categoryService.getCategoryById(PostModel.category_id);
    if (!categoryCheck.success || categoryCheck.data.length === 0) {
      response.success = false;
      response.message = `Category with id ${PostModel.category_id} does not exist.`;
      response.status = 404;
      return reject(response);
    }

    // Ensure title uniqueness in the new category
    const titleConflict = await getPostByCategoryIdAndTitle(PostModel.category_id, PostModel.title);
    if (titleConflict.data && titleConflict.data.some(post => post.id !== PostModel.id)) {
      response.success = false;
      response.message = `The title "${PostModel.title}" is already used in this category.`;
      response.status = 409;
      return reject(response);
    }
    
if (!PostModel.id || !PostModel.category_id || !PostModel.user_id) {
  response.success = false;
  response.message = "Missing required fields for update.";
  return reject(response);
}

    // Update query (no need to update image, as it remains the same unless provided)
    const query = `UPDATE Post 
                   SET category_id = ?, title = ?, body = ? 
                   WHERE id = ? AND user_id = ?`;

    // Use PostModel.user_id from the post itself (instead of session user ID)
    connection.query(
      query,
      [PostModel.category_id, PostModel.title, PostModel.body, PostModel.id, PostModel.user_id],
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
