const router = require("express").Router();
const actions = require("../../../db/actions");
const middlewares = require("../middlewares");

router.get("/posts", middlewares.isDbReady, async (req, res) => {
  const postId = req.body.postId;
  if (postId) {
    try {
      const payload = await actions.postWithReplies(postId);
      res.json(payload);
    } catch (err) {
      if (err.message.includes("NotFound")) {
        res.status(404).json({
          error: "No such Post",
        });
      } else {
        res.status(400).json({
          error: "Invalid Request",
          details: err,
        });
      }
    }
  } else {
    try {
      const payload = await actions.getPosts();
      res.json({
        data: payload,
      });
    } catch (err) {
      res.status(400).json({
        error: "Invalid Request",
        details: err,
      });
    }
  }
});

router.post(
  "/posts",
  middlewares.isDbReady,
  middlewares.isAuthenticated,
  async (req, res) => {
    try {
      let data = req.body;
      let post = await actions.createPost(data);
      res.json({
        postId: post._id,
        createdAt: post.get("createdAt"),
      });
    } catch (err) {
      if (err.message.includes("NotFound")) {
        res.status(404).json({
          error: err.message,
        });
      } else {
        res.status(400).json({
          error: "Invalid Request",
          details: err,
        });
      }
    }
  }
);

router.post(
  "/rating",
  middlewares.isDbReady,
  middlewares.isAuthenticated,
  async (req, res) => {}
);

module.exports = router;
