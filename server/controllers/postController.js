const Post = require("../models/Post");

const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        if (!content) return res.status(400).json({ message: "Content is required" });

        const newPost = await Post.create({
            user: req.user.id,
            content,
            image,
        });

        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username")
            .populate("comments.user","username")
            .sort({ createdAt: -1 });
            

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        post.content = req.body.content || post.content;
        post.image = req.body.image || post.image; 
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      const likedIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);
  
      if (likedIndex === -1) {
        post.likes.push({ user: req.user.id });
      } else {
        post.likes.splice(likedIndex, 1);
      }
  
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Comment text is required" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = {
            user: req.user.id,
            text,
            createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        const updatedPost = await Post.findById(req.params.id)
            .populate("user", "username") 
            .populate("comments.user","username")

        res.json(updatedPost); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };

  
  
  const deleteComment = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      const comment = post.comments.find(comment => comment._id.toString() === req.params.commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      if (comment.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
      }
  
      post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentId);
      await post.save();
  
      res.json({ message: "Comment deleted", post });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { createPost, getAllPosts, updatePost, deletePost, likePost, addComment, deleteComment };
