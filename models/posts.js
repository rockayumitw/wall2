const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '姓名未填寫']
  },
  replies: {
    type: mongoose.Schema.ObjectId,
    ref: 'Replies',
    required: [false, '']
  },
  tags: [
    {
      type: String,
      required: [true, '貼文標籤 tags 未填寫']
    }
  ],
  type: {
    type: String,
    enum:['group','person'],
    required: [true, '貼文類型 type 未填寫']
  },
  image: {
    type: String,
    default: ""
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: [true, 'Content 未填寫'],
  },
  likes: {
    type: Number,
    default: 0
  },
  comments:{
    type: Number,
    default: 0
  },
},{
  versionKey: false,
});

const posts = mongoose.model(
  'Posts',
  postsSchema
);

module.exports = posts;