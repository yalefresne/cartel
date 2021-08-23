const router = require("express").Router();
const actions = require("../../../db/actions");
const { ratingExists, validCredentials } = require("../../../validators");
const middlewares = require("../middlewares");
const passport = require("passport");

router.get("/posts", async (req, res) => {
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

  middlewares.isAuthenticated,
  async (req, res) => {
    let data = req.body;

    const rating = await ratingExists(data.userId, data.postId);

    if (rating === null) {
      const { error } = await actions.createRating(data);
      if (error) {
        res.status(400).json({
          error: error,
        });
      } else {
        res.json({
          data: "success",
        });
      }
    } else {
      const { error } = await actions.updateRating(rating, data.rating);
      if (error) {
        res.status(400).json({
          error: error,
        });
      } else {
        res.json({
          data: "success",
        });
      }
    }
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) next(err);
      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      }

      return status(400).info;
    }
  )(req, res, next);
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const invalid = await validCredentials(username, password);
  if (!invalid) {
    const user = await actions.createUser(username, password);
    user.token = passportUser.generateJWT();
    return res.json({ user: user.toAuthJSON() });
  } else {
    res.status(400).json({
      error: invalid,
    });
  }
});

router.post("/user", (req, res) => {});

module.exports = router;
