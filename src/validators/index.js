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

function validUserName(userName) {
  return userName !== undefined && userName.length > 2
    ? ""
    : "username length should be atleast 3 characters long.";
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

module.exports = {
  validatePostContent,
  validUserName,
  userExists,
  postExists,
  ratingExists,
  validateRating,
};
