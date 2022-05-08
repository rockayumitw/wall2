const express =  require('express');
const router = express.Router();
const postsController = require('../controllers/posts');

// 取得列表
// 網址範例: http://localhost:3000/posts
// fathomless-taiga-19978.herokuapp.com
router.post('/', async (req, res, next) => {
        /**
        * #swagger.tags = ['Posts']
        */
    postsController.get(req, res, next)
});

// 新增
router.post('/create', async (req, res, next) => postsController.create(req, res, next));

// 刪除 -全部
router.delete('/', async (req, res, next) => postsController.delete(req, res, next))

// 刪除 -單筆
router.delete('/:id', async (req, res, next) => postsController.deleteQuery(req, res, next))

// 編輯 -單筆
router.patch('/:id', async(req, res, next) => postsController.editQuery(req, res, next))

module.exports = router;