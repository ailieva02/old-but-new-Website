const connection = require("../dbConn");
const ResponseModel = require("../models/responseModel");
const RatingModel = require("../models/ratingModel");
const postService = require("../services/postService");
const userService = require("../services/userService");
const { response } = require("express");

const getAllRatingsByPostId = (postId) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM Rating WHERE postId = ?";

    connection.query(query, [postId], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;
        return reject(response); // Reject with response
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;
        if (results.length === 0) {
          response.message = `No ratings found for postId: ${postId}!`;
        }
        return resolve(response); // Resolve with response
      }
    });
  }).catch((error) => {
    const response = new ResponseModel();
    response.message = error.message || error;
    response.success = false;
    return response;
  });
};

const getRatingById = (id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM rating WHERE id = ?";

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
          response.message = "No rating was found!";
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

const getAverageRatingForPostId = (postId) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `SELECT AVG(stars) AS average_stars
                        FROM Rating
                        WHERE postId = ?`;

    connection.query(query, [postId], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;

        reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.data = results[0]; 

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

const createRating = (RatingModel) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    try {
      // Check for existing rating
      const checkQuery = `SELECT id FROM Rating WHERE userId = ? AND postId = ?`;
      connection.query(
        checkQuery,
        [RatingModel.userId, RatingModel.postId],
        async (checkError, checkResults) => {
          if (checkError) {
            response.success = false;
            response.status = 500;
            response.message = `Error checking existing rating: ${checkError.message}`;
            return reject(response);
          }

          if (checkResults.length > 0) {
            // Update existing rating
            const updateQuery = `UPDATE Rating SET stars = ?, createdAt = ? WHERE id = ?`;
            const dateTimeNow = new Date().toISOString().slice(0, 19).replace("T", " ");
            connection.query(
              updateQuery,
              [RatingModel.stars, dateTimeNow, checkResults[0].id],
              (updateError, updateResults) => {
                if (updateError) {
                  response.success = false;
                  response.status = 500;
                  response.message = `Error updating rating: ${updateError.message}`;
                  return reject(response);
                }
                response.status = 200;
                response.success = true;
                response.message = "Rating updated successfully";
                response.data = { id: checkResults[0].id };
                resolve(response);
              }
            );
          } else {
            // Insert new rating
            const insertQuery = `INSERT INTO Rating (userId, postId, createdAt, stars) VALUES (?, ?, ?, ?)`;
            const dateTimeNow = new Date().toISOString().slice(0, 19).replace("T", " ");
            connection.query(
              insertQuery,
              [RatingModel.userId, RatingModel.postId, dateTimeNow, RatingModel.stars],
              (insertError, insertResults) => {
                if (insertError) {
                  response.success = false;
                  response.status = 500;
                  response.message = `Error creating rating: ${insertError.message}`;
                  return reject(response);
                }
                response.status = 201;
                response.success = true;
                response.message = "Rating created successfully";
                response.data = { id: insertResults.insertId };
                resolve(response);
              }
            );
          }
        }
      );
    } catch (error) {
      console.error('Service - Error:', error.stack);
      response.success = false;
      response.status = error.status || 500;
      response.message = error.message || "Internal server error";
      reject(response);
    }
  });
};

const updateRating = (rating) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();
    // Ensure the rating object has the id
    if (!rating.id) {
      response.success = false;
      response.message = "Rating ID is missing!";
      return reject(response);
    }
    
    const query = "UPDATE Rating SET stars = ? WHERE id = ?";

    connection.query(query, [rating.stars, rating.id], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error updating the rating: ${error}`;
        return reject(response);
      } else {
        response.status = 200;
        response.success = true;
        response.message = "Rating updated successfully!";
        resolve(response);
      }
    });
  }).catch((error) => {
    const response = new ResponseModel();
    response.message = error.message || error;
    response.success = false;
    return response;
  });
};

const getRatingByPostAndUser = (postId, userId) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM Rating WHERE postId = ? AND userId = ?";

    connection.query(query, [postId, userId], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;
        return reject(response); // Reject with response
      } else {
        if (results.length > 0) {
          const rating = results[0]; 
          response.status = 200;
          response.success = true;
          response.data = rating; // Pass the full rating object
        } else {
          response.status = 404;
          response.success = false;
          response.message = "No rating found for this user and post";
        }
        resolve(response); // Resolve with response
      }
    });
  }).catch((error) => {
    const response = new ResponseModel();
    response.message = error.message || error;
    response.success = false;
    return response;
  });
};



const deleteRatingById = (id) => {
  return new Promise(async (resolve, reject) => {
    const response = new ResponseModel();

    const query = `DELETE FROM Rating 
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

module.exports = {
  getAllRatingsByPostId,
  getRatingById,
  getAverageRatingForPostId,
  createRating,
  updateRating,
  deleteRatingById,
  getRatingByPostAndUser,
};
