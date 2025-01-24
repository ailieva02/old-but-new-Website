const RatingModel = require("../models/ratingModel");
const ratingService = require("../services/ratingService");

const createRating = async (req, res) => {
  const newRating = new RatingModel();

  newRating.post_id = req.body.post_id;
  newRating.user_id = req.body.user_id;
  newRating.stars = parseInt(req.body.stars);

  const result = await ratingService.createRating(newRating);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const updateRating = async (req, res) => {
  const { post_id, user_id, stars } = req.body;

  try {
    // Step 1: Check if the user already has a rating for the post
    const existingRatingResponse = await ratingService.getRatingByPostAndUser(post_id, user_id);
    const existingRating = existingRatingResponse.data;  // Access the rating object directly
    
    if (!existingRating) {
      // If no rating exists for this user and post, return 404
      return res.status(404).json({ message: "Rating not found for this user and post" });
    }

    // Step 2: Update the rating, including the id
    existingRating.stars = stars;

    const result = await ratingService.updateRating(existingRating);  // Pass the complete object
    if (result) {
      res.status(result.status).json(result);  // Successful update
    } else {
      res.status(500).json({ message: "Something went wrong during the update!" });
    }
  } catch (error) {
    console.error("Error updating rating:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getRatingByPostAndUser = async (req, res) => {
  const { post_id, user_id } = req.query;

  try {
    const result = await ratingService.getRatingByPostAndUser(post_id, user_id);

    if (result.success && result.data) {
      res.status(result.status).json(result);
    } else {
      res.status(404).json({ message: "Rating not found for this post and user combination" });
    }
  } catch (error) {
    console.error("Error fetching rating by post and user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getAllRatingsByPostId = async (req, res) => {
  const post_id = parseInt(req.query.post_id);
  try {
    const result = await ratingService.getAllRatingsByPostId(post_id);

    if (result.success) {
      res.status(result.status).json(result);
    } else {
      res.status(result.status || 500).json(result);
    }
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getRatingById = async (req, res) => {
  const ratingId = parseInt(req.params.id);
  const result = await ratingService.getRatingById(ratingId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getAverageRatingForPostId = async (req, res) => {
  const post_id = parseInt(req.body.id);
  const result = await ratingService.getAverageRatingForPostId(post_id);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const deleteRatingById = async (req, res) => {
  const ratingId = parseInt(req.body.rating_id); // Changed 'id' to 'rating_id'
  
  // Check if ratingId is a valid number before proceeding
  if (isNaN(ratingId)) {
    return res.status(400).json({ message: "Invalid rating ID" });
  }

  const result = await ratingService.deleteRatingById(ratingId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};


module.exports = {
  createRating,
  updateRating,
  getAllRatingsByPostId,
  getRatingById,
  getAverageRatingForPostId,
  deleteRatingById,
  getAverageRatingForPostId,
  getRatingByPostAndUser,
};
