const express =  require('express');
const router = express.Router();
const postsController = require('../controllers/posts');
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require('../service/auth');


// 網址範例: http://localhost:3000/posts
// fathomless-taiga-19978.herokuapp.com

// 取得列表 -無須權限
router.get('/', handleErrorAsync(async (req, res, next)=> postsController.get(req, res, next)));

// 取得單筆 -無須權限　--*
router.get('/:id', handleErrorAsync(async (req, res, next) => postsController.getQuery(req, res, next)));

// 新增
router.post('/create', isAuth, handleErrorAsync(async (req, res, next) => postsController.create(req, res, next)));

// 刪除 -全部
router.delete('/', isAuth, handleErrorAsync(async (req, res, next) => postsController.delete(req, res, next)))

// 刪除 -單筆
router.delete('/:id', isAuth, handleErrorAsync(async (req, res, next) => postsController.deleteQuery(req, res, next)));

// 編輯 -單筆
router.patch('/:id', isAuth, handleErrorAsync(async(req, res, next) => postsController.editQuery(req, res, next)));

// 新增 -喜歡
router.post('/:id/likes', isAuth, handleErrorAsync(async(req, res, next) => postsController.postLikes(req, res, next)));

// 移除 -喜歡
router.delete('/:id/likes', isAuth, handleErrorAsync(async(req, res, next) => postsController.deleteLikes(req, res, next)));

// 新增留言
router.post('/:id/comment', isAuth, handleErrorAsync(async(req, res, next) => postsController.addComment(req, res, next)));


module.exports = router;