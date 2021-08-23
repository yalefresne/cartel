const { User, Post, Rating } = require("../db/models");

async function userExists(userId) {
  try {
    const user = await User.findById(userId);
    return user ? user : null;
  } catch (error) {
    return null;
  }
}

async function postExists(postId) {
  try {
    const post = await Post.findById(postId);
    return post ? post : null;
  } catch (error) {
    return null;
  }
}

async function ratingExists(userId, postId) {
  try {
    const rating = await Rating.findOne({
      userId: userId,
      postId: postId,
    }).exec();
    return rating ? rating : null;
  } catch (error) {
    return null;
  }
}

function validatePostContent(content) {
  return content !== undefined && content.length !== 0
    ? ""
    : "Content length should be atleast 1 characters long.";
}

async function validCredentials(username, password) {
  let userErr =
    username !== undefined && username.length > 2
      ? ""
      : "username should be atleast 3 characters long";

  const passErr =
    password !== undefined && password.length > 7
      ? ""
      : "password should be atleast 8 characters long";

  if (!userErr && !passErr) {
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      userErr = "username already exists";
    }
  }

  return !userErr && !passErr
    ? null
    : {
        username: userErr,
        password: passErr,
      };
}

function validateRating(data) {
  if (
    data.postId !== undefined &&
    data.userId !== undefined &&
    (data.rating === true || data.rating === false) &&
    postExists(data.postId) &&
    userExists(data.userId)
  ) {
    return {
      data: new Rating(data),
    };
  } else {
    return {
      error: "Invalid data",
    };
  }
}

function getTokenFromHeaders(req) {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Token") {
    return authorization.split(" ")[1];
  }
  return null;
}

module.exports = {
  validatePostContent,
  validCredentials,
  userExists,
  postExists,
  ratingExists,
  validateRating,
  getTokenFromHeaders,
};
