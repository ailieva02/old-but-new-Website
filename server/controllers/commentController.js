const CommentModel = require("../models/commentModel");
const commentService = require("../services/commentService");

const createComment = async (req, res) => {
  const newComment = new CommentModel();

  newComment.postId = req.body.postId;
  newComment.userId = req.body.userId;
  newComment.body = req.body.body;
  newComment.public = req.body.public;
  newComment.currentUserId = req.body.currentUserId;
  newComment.currentUserRole = req.body.currentUserRole;

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
  commentToUpdate.public = req.body.public;
  commentToUpdate.currentUserId = req.body.currentUserId;
  commentToUpdate.currentUserRole = req.body.currentUserRole;
  commentToUpdate.commentUserId = req.body.commentUserId;

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
  const currentUserId = req.body.currentUserId;
  const currentUserRole = req.body.currentUserRole;
  const commentUserId = req.body.commentUserId;

  console.log("current user id: ", req.body.currentUserId);
  console.log("current user role: ", req.body.currentUserRole);
  console.log("commentId: ", commentId);
  console.log("THe comments user id is: ", req.body.commentUserId);


  const result = await commentService.deleteCommentById(commentId, currentUserId, currentUserRole, commentUserId);

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
