const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("userId", "username")
    .sort({createdAt: -1});
  res.json(posts);
});

router.post("/", auth, async (req, res) => {
  const post = await Post.create({
    userId: req.user.id,
    content: req.body.content,
  });
  res.json(post);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (String(post.userId) === req.user.id || req.user.isAdmin) {
    await post.deleteOne();
    res.sendStatus(204);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
