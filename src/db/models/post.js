const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
	replyId: {
    type: mongoose.Types.ObjectId,
  },
	tags: {
    type: [String],
    default: []
  },
	content: {
    type: String,
    required: true
  },
	images: {
    type: [String],
    default: []
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  replies: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

module.exports = mongoose.model('Post', postSchema);