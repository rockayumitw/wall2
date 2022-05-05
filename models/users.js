const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '姓名未填寫']
  },
  // email -前端不顯示
  email: {
    type: String,
    required: [true, 'email未填寫'],
    select: false
  },
  // password -前端不顯示
  password: {
    type: String,
    required: [true, '密碼未填寫'],
    unique: true,
    lowercase: true,
    select: false,
  },
  image: {
    type: String,
    default: ""
  },
  sex: {
    type: String,
    required: [false, '性別未填選'],
    default: ""
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
},{
  versionKey: false,
});

const users = mongoose.model('User', userSchema);

module.exports = users;