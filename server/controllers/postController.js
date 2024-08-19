const PostModel = require("../models/postModel");
const postService = require("../services/postService");

const createPost = async (req, res) => {
  const newPost = new PostModel();

  newPost.category_id = req.body.category_id;
  newPost.user_id = req.body.user_id;
  newPost.title = req.body.title;
  newPost.body = req.body.body;
  newPost.image = req.body.image;

  const result = await postService.createPost(newPost);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const updatePost = async (req, res) => {
  const postId = parseInt(req.body.id);
  const postToUpdate = await postService.getPostById(postId);

  postToUpdate.id = postId;
  postToUpdate.title = req.body.title;
  postToUpdate.body = req.body.body;
  postToUpdate.image = req.body.image;

  const result = await postService.updatePost(postToUpdate);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const deletePostById = async (req, res) => {
  const postId = parseInt(req.body.id);
  const result = await postService.deletePostById(postId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const deleteAllPosts = async (req, res) => {
  const result = await postService.deleteAllPosts();

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getAllPosts = async (req, res) => {
  const result = await postService.getAllPosts();
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getPostById = async (req, res) => {
  const postId = parseInt(req.params.id);
  const result = await postService.getPostById(postId);

  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getPostByCategoryIdAndTitle = async (req, res) => {
  const category_id = parseInt(req.body.category_id);
  const title = req.body.title;

  const result = await postService.getPostByCategoryIdAndTitle(
    category_id,
    title
  );
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getPostsByCategoryId = async (req, res) => {
  const category_id = parseInt(req.body.category_id);

  const result = await postService.getPostsByCategoryId(category_id);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getPostsByUserId = async (req, res) => {
  const user_id = parseInt(req.body.user_id);

  const result = await postService.getPostsByUserId(user_id);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
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
