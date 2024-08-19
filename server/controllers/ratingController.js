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
  const ratingId = parseInt(req.body.id);
  const ratingToUpdate = await ratingService.getRatingById(ratingId);

  ratingToUpdate.id = ratingId;
  ratingToUpdate.stars = req.body.stars;

  const result = await ratingService.updateRating(ratingToUpdate);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
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
  const ratingId = parseInt(req.body.id);
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
};
