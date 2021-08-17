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
    // true for like, false for dislike
    type: Boolean,
    default: undefined
  }
});

module.exports = mongoose.model('Rating', ratingSchema);