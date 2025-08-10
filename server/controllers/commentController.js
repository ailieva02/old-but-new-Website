const CommentModel = require("../models/commentModel");
const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  const newComment = new CommentModel();

  newComment.postId = req.body.postId;
  newComment.userId = req.body.userId;
  newComment.body = req.body.body;

  const result = await commentService.createComment(newComment);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

// I will add some comments here:


// blbalblalblablalbalblablbalbalbla


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
  const postId = parseInt(req.query.postId); // Use req.query for query parameters
  if (isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const result = await commentService.getAllCommentsByPostId(postId);
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
