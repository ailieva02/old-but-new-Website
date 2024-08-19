const CommentModel = require("../models/commentModel");
const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  const newComment = new CommentModel();

  newComment.post_id = req.body.post_id;
  newComment.user_id = req.body.user_id;
  newComment.body = req.body.body;

  const result = await commentService.createComment(newComment);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const updateComment = async (req, res) => {
  const commentId = parseInt(req.body.id);
  const commentToUpdate = await commentService.getCommentById(commentId);

  commentToUpdate.id = commentId;
  commentToUpdate.body = req.body.body;

  const result = await commentService.updateComment(commentToUpdate);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const deleteAllComments = async (req, res) => {
  const result = await commentService.deleteAllComments();

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const deleteCommentById = async (req, res) => {
  const commentId = parseInt(req.body.id);
  const result = await commentService.deleteCommentById(commentId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getCommentById = async (req, res) => {
  const commentId = parseInt(req.params.id);
  const result = await commentService.getCommentById(commentId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getAllCommentsByPostId = async (req, res) => {
  const post_id = parseInt(req.query.postId); // Use req.query for query parameters
  if (isNaN(post_id)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const result = await commentService.getAllCommentsByPostId(post_id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const getAllComments = async (req, res) => {
  const result = await commentService.getAllComments();

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteAllComments,
  deleteCommentById,
  getCommentById,
  getAllCommentsByPostId,
  getAllComments,
};
