const express = require("express");
const ratingController = require("../controllers/ratingController");
const router = express.Router();

router.get("/ratings/:id", ratingController.getRatingById);
router.get("/ratings-by-post-id", ratingController.getAllRatingsByPostId);
router.get(
  "/ratings-average-by-post-id",
  ratingController.getAverageRatingForPostId
);
router.get("/ratings-by-post-and-user", ratingController.getAllRatingsByPostId);
router.delete("/ratings/delete", ratingController.deleteRatingById);
router.post("/ratings/create", ratingController.createRating);
router.put("/ratings/update", ratingController.updateRating);

module.exports = router;