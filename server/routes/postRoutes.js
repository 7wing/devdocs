const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

// CREATE a new post
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const user = req.user;

    const authorId = user.uid || user.id;
    const authorName = user.name || user.displayName || "Anonymous Developer";

    if (!title || !content || !authorId) {
      return res.status(400).json({ message: "Title, content and login required." });
    }

    const newPost = new Post({
      title,
      content,
      tags,
      author: authorName,
      authorId: authorId,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ id: savedPost._id, title: savedPost.title });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Internal server error while creating post." });
  }
});

// READ ALL posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({})
      .select("title content tags author date")
      .sort({ date: -1 })
      .lean();

    const formattedPosts = posts.map((post) => {
      const plainText = (post.content || "").replace(/<[^>]+>/g, "");
      const excerpt = plainText.split(". ").slice(0, 2).join(". ") + "..."; // first 2 sentences

      return {
        id: post._id.toString(),
        title: post.title,
        excerpt,
        date: post.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        tags: post.tags,
        author: post.author,
      };
    });

    res.status(200).json(formattedPosts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Internal server error while fetching posts." });
  }
});

// READ posts by author
router.get("/author/:authorId", async (req, res) => {
  try {
    const { authorId } = req.params;
    const posts = await Post.find({ authorId })
      .select("title content tags author date")
      .sort({ date: -1 })
      .lean();

    const formattedPosts = posts.map((post) => {
      const plainText = (post.content || "").replace(/<[^>]+>/g, "");
      const excerpt = plainText.split(". ").slice(0, 2).join(". ") + "...";

      return {
        id: post._id.toString(),
        title: post.title,
        excerpt,
        date: post.date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        tags: post.tags,
        author: post.author,
      };
    });

    res.status(200).json(formattedPosts);
  } catch (err) {
    console.error("Error fetching posts by author:", err);
    res.status(500).json({ message: "Internal server error while fetching posts." });
  }
});

// READ ONE post by ID
router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).lean();
    if (!post) return res.status(404).json({ message: "Post not found." });

    const plainText = (post.content || "").replace(/<[^>]+>/g, "");
    const excerpt = plainText.split(". ").slice(0, 2).join(". ") + "...";

    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      excerpt,
      tags: post.tags,
      author: post.author,
      date: post.date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    res.status(200).json(formattedPost);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Internal server error while fetching post." });
  }
});

// UPDATE a post
router.put("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = req.body;
    const userId = req.user.uid || req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this post." });
    }

    await Post.findByIdAndUpdate(postId, { $set: updateData }, { runValidators: true });
    res.status(200).json({ message: "Post updated successfully." });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Internal server error while updating post." });
  }
});

// DELETE a post
router.delete("/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.uid || req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (post.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post." });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Internal server error while deleting post." });
  }
});

module.exports = router;
