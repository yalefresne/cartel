/*
 * This file contains all the functions
 * which perform CRUD operations
 * on the database.
 */
const { Post, User, Rating } = require("./models");
const {
  postExists,
  userExists,
  validatePostContent,
  validUserName,
  validateRating,
  validCredentials,
} = require("../validators");
const { randomUserSuffix } = require("../utils");

async function postWithReplies(postId) {
  try {
    const post = await Post.findById(postId).exec();
    if (post) {
      const replies = await Post.find({ replyId: postId })
        .sort("-createdAt")
        .exec();
      return {
        data: {
          post,
          replies: [...replies],
        },
      };
    } else {
      throw "NotFound";
    }
  } catch (err) {
    throw Error(err);
  }
}

async function getPosts() {
  // GET ALL POSTS
  // TODO:Implement personalized/trending posts
  const payload = await Post.find({}).exec();
  return payload;
}

async function createPost(data) {
  try {
    let postData = {};

    let contentErr = validatePostContent(data.content);
    if (contentErr !== "") throw new Error(contentErr);

    if ((await userExists(data.userId)) === null) {
      throw new Error(`UserNotFound - userId ${data.userId}`);
    }

    if (data.replyId) {
      if ((await postExists(data.replyId)) === null) {
        throw new Error(`PostNotFound - postId ${data.replyId}`);
      }
      postData.replyId = data.replyId;
    } else {
      postData.replyId = null;
    }

    postData.content = data.content;
    postData.userId = data.userId;

    let post = new Post(postData);

    // TODO: Not a transaction, lol. figure something out.
    await post.save();
    if (data.replyId) {
      await Post.findByIdAndUpdate(data.replyId, {
        $inc: { replies: 1 },
      }).exec();
    }

    return post;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function createUser(username, password) {
  let user = new User({
    username: username,
  });
  await user.setPassword(password);
  await user.save();
  return user;
}

async function createRating(data) {
  const r = validateRating(data);
  if (r.error === undefined) {
    await r.data.save();
    if (data.rating === true) {
      await Post.findByIdAndUpdate(data.postId, {
        $inc: { likes: 1 },
      }).exec();
    } else {
      await Post.findByIdAndUpdate(data.postId, {
        $inc: { dislikes: 1 },
      }).exec();
    }
  }
  return r;
}

async function updateRating(rating, changedRating) {
  let existingRating = rating.get("rating");

  // [mongodb] cannot update existing field to undefined without deleting it
  existingRating = existingRating === undefined ? null : existingRating;
  changedRating = changedRating === undefined ? null : changedRating;

  let updateMap = {};
  if (existingRating === true) {
    if (changedRating === null) {
      updateMap = {
        $inc: { likes: -1 },
      };
    } else if (changedRating === false) {
      updateMap = {
        $inc: { likes: -1, dislikes: 1 },
      };
    }
  } else if (existingRating === false) {
    if (changedRating === null) {
      updateMap = {
        $inc: { dislikes: -1 },
      };
    } else if (changedRating === true) {
      updateMap = {
        $inc: { likes: 1, dislikes: -1 },
      };
    }
  } else if (existingRating === null) {
    if (changedRating === false) {
      updateMap = {
        $inc: { dislikes: 1 },
      };
    } else if (changedRating === true) {
      updateMap = {
        $inc: { likes: 1 },
      };
    }
  }

  if (changedRating != existingRating) {
    await Rating.findByIdAndUpdate(rating._id, {
      rating: changedRating,
    }).exec();

    const newRating = await Post.findByIdAndUpdate(
      rating.get("postId"),
      updateMap
    ).exec();
    return {
      data: newRating,
    };
  } else {
    return {
      error: "No Update Required",
    };
  }
}

module.exports = {
  postWithReplies,
  getPosts,
  createPost,
  createUser,
  createRating,
  updateRating,
};
