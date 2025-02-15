const express = require("express");
const { createPost, getAllPosts, updatePost, deletePost, likePost, addComment, deleteComment } = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getAllPosts);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like",protect,likePost);
router.post("/:id/comment",protect,addComment);
router.delete("/:id/comment/:commentId",protect,deleteComment);

module.exports = router;
