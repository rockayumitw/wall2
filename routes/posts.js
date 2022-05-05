const express =  require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

// 取得列表
// 網址範例: http://localhost:3000/posts
router.post('/', async (req, res, next) => postsController.get(req, res));

// 新增
router.post('/create', async (req, res, next) => postsController.create(req, res));

// 刪除 -全部
router.delete('/', async (req, res, next) => postsController.delete(req, res))

// 刪除 -單筆
router.delete('/:id', async (req, res, next) => postsController.deleteQuery(req, res))

// 編輯 -單筆
router.patch('/:id', async(req, res, next) => postsController.editQuery(req, res))

module.exports = router;