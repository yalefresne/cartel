/*
 * This file contains all the functions
 * which perform CRUD operations
 * on the database.
 */
const Post = require("./models/post");

module.exports = {
  postWithReplies: async (postId) => {
    try {
      let payload = {};
      const post = await Post.findById(postId).exec();
      if (post) {
        const replies = await Post.find({ replyId: postId })
          .sort("-createdAt")
          .exec();
        payload = {
          data: {
            post,
            replies: [...replies],
          },
        };
      } else {
        throw "NotFound";
      }
      return payload;
    } catch (err) {
      throw Error(err);
    }
  },

  getPosts: async () => {
    // GET ALL POSTS
    // TODO:Implement personalized/trending posts
    const payload = await Post.find({}).exec();
    return payload;
  },

  createPost: async (data) => {
    let postData = {
      content: data.content,
      userId: data.userId,
      replyId: data?.replyId
    };
    let post = new Post(postData);
    await post.save();
    return post;
  },
};
