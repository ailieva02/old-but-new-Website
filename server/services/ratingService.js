const connection = require("../dbConn");
const ResponseModel = require("../models/responseModel");
const RatingModel = require("../models/ratingModel");
const postService = require("../services/postService");
const userService = require("../services/userService");
const { response } = require("express");

const getAllRatingsByPostId = (post_id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM Rating WHERE post_id = ?";

    connection.query(query, [post_id], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;
        return reject(response); // Reject with response
      } else {
        response.status = 200;
        response.success = true;
        response.data = results;
        if (results.length === 0) {
          response.message = `No ratings found for post_id: ${post_id}!`;
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

const getAverageRatingForPostId = (post_id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = `SELECT AVG(stars) AS average_stars
                        FROM Rating
                        WHERE post_id = ?`;

    connection.query(query, [post_id], (error, results) => {
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

    const existingPostResult = await postService.getPostById(
      RatingModel.post_id
    );
    if (
      existingPostResult &&
      existingPostResult.data &&
      existingPostResult.data.length > 0
    ) {
      const existingUserResult = await userService.getUserById(
        RatingModel.user_id
      );
      if (
        existingUserResult &&
        existingUserResult.data &&
        existingUserResult.data.length > 0
      ) {
        const query = `INSERT INTO Rating (post_id, user_id, stars, date) 
                                VALUES(?, ?, ?, ?)`;

        const dateTimeNow = new Date();
        const formattedDateTimeNow = dateTimeNow
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        connection.query(
          query,
          [
            RatingModel.post_id,
            RatingModel.user_id,
            RatingModel.stars,
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
        response.message = `No user was found for this user id: ${RatingModel.user_id}!`;
        response.status = 409;
        response.success = false;

        reject(response);
      }
    } else {
      response.message = `No post was found for this post id: ${RatingModel.post_id}!`;
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

const updateRating = (rating) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();
    console.log("This is the response: ", response);
    
    // Ensure the rating object has the id
    if (!rating.id) {
      response.success = false;
      response.message = "Rating ID is missing!";
      return reject(response);
    }
    
    const query = "UPDATE Rating SET stars = ? WHERE id = ?";
    console.log("Rating stars: ", rating.stars);
    console.log("Rating ID: ", rating.id);

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

const getRatingByPostAndUser = (post_id, user_id) => {
  return new Promise((resolve, reject) => {
    const response = new ResponseModel();

    const query = "SELECT * FROM Rating WHERE post_id = ? AND user_id = ?";

    connection.query(query, [post_id, user_id], (error, results) => {
      if (error) {
        response.success = false;
        response.message = `Error querying the database: ${error}`;
        return reject(response); // Reject with response
      } else {
        if (results.length > 0) {
          const rating = results[0]; 
          console.log("Rating fetched: ", rating);  // Check if 'id' is in the result
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
