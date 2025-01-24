const express = require("express");
const multer = require("multer");
const path = require("path");
const postController = require("../controllers/postController");
const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../client/src/assets/images"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Define routes
router.get("/posts", postController.getAllPosts);
router.get("/posts/:id", postController.getPostById);
router.get("/posts-by-category-id", postController.getPostsByCategoryId);
router.get(
  "/posts-by-category-id-and-title",
  postController.getPostByCategoryIdAndTitle
);
router.get("/posts-by-user-id", postController.getPostsByUserId);
router.post("/posts/create", upload.single("image"), postController.createPost);
router.post("/posts/delete", postController.deletePostById);
router.post("/posts/delete-all", postController.deleteAllPosts);
router.put("/posts/update", postController.updatePost);



module.exports = router;
