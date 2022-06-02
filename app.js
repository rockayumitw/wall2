const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

// 記錄錯誤下來, 等到服務都處理完後, 停掉該process
process.on('uncaughtException', err => {
  console.log('Uncaughted Exception')
  console.log(err);
  console.log(err.name)
  process.exit(1);
})

// 引用env環境檔案
// dotenv.config({path: './config.env'});
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
console.log(`目前運行的環境: ${process.env.NODE_ENV}`)
console.log(`目前連接的DB: ${process.env.DATABASE}`)

// db設定
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// 連結資料庫
mongoose
  .connect(DB)
  .then(() => console.log('資料庫連接成功'))
  .catch((err) => console.log('資料庫連結失敗,' + err));

// 載入router
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');
const replyRouter = require('./routes/replies');

var app = express();

// 載入設定檔
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 使用路由
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/replies', replyRouter);

// swagger 文件
// 參數: 路徑、server、設定的檔案
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// 找不到頁面
app.use((req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: "無此頁面資訊",
    });
})

// 程式錯誤處裡

// production 回應模式
const resErrorProd = (err, res) => {
  if(err.isOperational) { // 是預期
    res.status(err.statusCode).json({
      message: err.message,
    })
  } else {
    // 未預期
    console.log('出現重大錯誤', err)
    res.status(err.statusCode).json({
      message: '系統錯誤, 請洽系統管理員',
      status: 'error'
    })
  }
}

// dev 回應模式
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  })
}

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if(process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res)
  }
  if(err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確, 請重新輸入!'
    error.isOperational = true;
    return resErrorProd(err, res)
  }
  resErrorProd(err, res)
})

// 未捕捉到的 catch
process.on('unhandledRejection', (reason, promise) => {
  console.log('為捕捉到的 rejection:', promise, '原因:', reason);
  // 紀錄於 log 上
})

module.exports = app;
