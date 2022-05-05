const mongoose = require('mongoose');
const repliesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, '姓名未填寫']
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Posts',
    required: [true, '回覆文章id未填寫'],
  },
  content:{
    type: String,
    required: [true, '回覆未填寫'],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
},{
  versionKey: false,
});

const replies = mongoose.model(
  'Replies',
  repliesSchema
);

module.exports = replies;