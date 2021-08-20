/*
 * This file contains all the functions
 * which perform CRUD operations
 * on the database.
 */
const { Post, User } = require("./models");
const {
  postExists,
  userExists,
  validatePostContent,
  validUserName,
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
    let contentErr = validatePostContent(data.content);
    if (contentErr !== "") throw new Error(contentErr);

    if ((await userExists(data.userId)) === null) {
      throw new Error(`UserNotFound - userId ${data.userId}`);
    }

    let postData = {};

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

async function createUser(name) {
  if (validUserName(name) === "") {
    try {
      const maxTries = 12;
      let tries = 0;
      while (tries < maxTries) {
        const can = name + "#" + randomUserSuffix();
        const r = await User.findOne({ userName: can }).exec();
        if (r === null) {
          let user = new User({
            userName: can,
          });
          await user.save();
          return user;
        }
        tries += 1;
      }
      throw new Error(
        `Tried ${maxTries} times, but couldn't create user for ${name}`
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  } else {
    console.log("Hello");
    return null;
  }
}

module.exports = {
  postWithReplies,
  getPosts,
  createPost,
  createUser,
};
