const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  rating: {
    // true for like, false for dislike,
    // null if user liked/disliked, then removed their rating
    type: Boolean,
  }
});

module.exports = mongoose.model('Rating', ratingSchema);