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
    minlength: 8 // 最大8碼
  },
  image: {
    type: String,
    default: ""
  },
  sex: {
    type: String,
    enum: ['male', 'female'], // 只支援帶甚麼值
    required: [false, '性別未填選'],
    default: "female"
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  role: {
    type: String,
    enum: ['enum', 'user', 'ads']
  }
},{
  versionKey: false,
});

const users = mongoose.model('User', userSchema);

module.exports = users;