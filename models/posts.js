const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema({
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
  replies: {
    type: mongoose.Schema.ObjectId,
    ref: 'Replies',
    required: [false, '']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, '姓名未填寫']
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'user'
    }
  ]
},{
  versionKey: false,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
});

// virtual: 虛擬
// 會在doucoment偷掛一個東西上去, 可聯想成join概念
postsSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
})

const posts = mongoose.model(
  'Post',
  postsSchema
);

module.exports = posts;