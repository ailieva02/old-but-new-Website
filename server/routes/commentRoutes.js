const express = require("express");
const commentController = require("../controllers/commentController");
const router = express.Router();

router.get("/comments", commentController.getAllComments);
router.get("/comments/:id", commentController.getCommentById);
router.get("/comments-by-post-id", commentController.getAllCommentsByPostId);
router.post("/comments/delete", commentController.deleteCommentById);
router.post("/comments/delete-all", commentController.deleteAllComments);
router.post("/comments/create", commentController.createComment);
router.post("/comments/update", commentController.updateComment);

module.exports = router;
