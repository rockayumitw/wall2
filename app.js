const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// env
dotenv.config({path: './config.env'});

// db設定
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );

// 連結資料庫
mongoose
  //.connect('mongodb://localhost:27017/wall') // 本機端
  .connect(DB)
  .then(() => console.log('資料庫連接成功')).catch((err) => consle.log('資料庫連結失敗,' + e));

// 載入router
const postRouter = require('./routes/posts');

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

// 找不到頁面
app.use((req, res, next) => {
    res.status(404).send('無此頁面')
})

// 程式錯誤
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('程式碼有些問題, 請稍後嘗試')
})

module.exports = app;
