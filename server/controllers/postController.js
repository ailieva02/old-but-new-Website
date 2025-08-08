const PostModel = require("../models/postModel");
const postService = require("../services/postService");

const createPost = async (req, res) => {
  try {
    const { category_id, title, body, currentUserId, currentUserRole } = req.body;
    const image = req.file;

    // Validate required fields
    if (!category_id || !title || !body || !currentUserId || !currentUserRole) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Missing required fields: category_id, title, body, currentUserId, or currentUserRole',
      });
    }

    const postModel = {
      category_id,
      title,
      body,
      user_id: currentUserId, // Use currentUserId as user_id
      image: image ? image.filename : null,
    };

    const result = await postService.createPost(postModel, currentUserId, currentUserRole);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error in createPost:', error.stack);
    res.status(error.status || 500).json({
      success: false,
      status: error.status || 500,
      message: error.message || 'Internal server error',
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id, category_id, title, body, image, user_id } = req.body;
    const newImage = req.file ? req.file.filename : image;
    const postModel = {
      id: parseInt(id),
      category_id: parseInt(category_id),
      user_id,
      title,
      body,
      image: newImage,
    };

    const response = await postService.updatePost(postModel);
    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating the post",
      error: error.message,
    });
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
