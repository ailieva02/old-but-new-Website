const PostModel = require("../models/postModel");
const postService = require("../services/postService");

const createPost = async (req, res) => {
  try {
    const { categoryId, title, body, currentUserId, currentUserRole } = req.body;
    const image = req.file;

    // Validate required fields
    if (!categoryId || !title || !body || !currentUserId || !currentUserRole) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Missing required fields: categoryId, title, body, currentUserId, or currentUserRole',
      });
    }

    const postModel = {
      categoryId,
      title,
      body,
      userId: currentUserId, // Use currentUserId as userId
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
    const { id, categoryId, title, body, image, userId, currentUserId, currentUserRole } = req.body;
    const newImage = req.file ? req.file.filename : image;
    const postModel = {
      id: parseInt(id),
      categoryId: parseInt(categoryId),
      userId,
      title,
      body,
      image: newImage,
      currentUserId: currentUserId,
      currentUserRole: currentUserRole
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
  try {
    const { id, currentUserId, currentUserRole } = req.body;

    // Validate required fields
    if (!id || !currentUserId || !currentUserRole) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Missing required fields: id, currentUserId, or currentUserRole",
      });
    }

    const result = await postService.deletePostById(
      parseInt(id),
      parseInt(currentUserId),
      currentUserRole
    );

    res.status(result.status).json(result);
  } catch (error) {
    console.error("Error in deletePostById:", error.stack);
    res.status(error.status || 500).json({
      success: false,
      status: error.status || 500,
      message: error.message || "Something went wrong!",
    });
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
  const categoryId = parseInt(req.body.categoryId);
  const title = req.body.title;

  const result = await postService.getPostByCategoryIdAndTitle(
    categoryId,
    title
  );
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getPostsByCategoryId = async (req, res) => {
  const categoryId = parseInt(req.body.categoryId);

  const result = await postService.getPostsByCategoryId(categoryId);
  if (result) {
    res.status(result.status).json(result);
  } else {
    res.status(500).json("Something went wrong!");
  }
};

const getPostsByUserId = async (req, res) => {
  const userId = parseInt(req.body.userId);

  const result = await postService.getPostsByUserId(userId);
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
