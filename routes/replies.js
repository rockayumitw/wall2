const express =  require('express');
const router = express.Router();
const repliesController = require('../controllers/replies');

const handleErrorAsync = require("../service/handleErrorAsync");
// 取得列表
// 網址範例: http://localhost:3000/replies

/**
 * #swagger.tags = ['replies']
 */

// router.get('/', async (req, res, next) => postsController.get(req, res));

// 新增
router.post('/', handleErrorAsync(async (req, res, next) => repliesController.create(req, res)));

// // 刪除 -全部
// router.delete('/', async (req, res, next) => postsController.delete(req, res))

// // 刪除 -單筆
// router.delete('/:id', async (req, res, next) => postsController.deleteQuery(req, res))

// // 編輯 -單筆
// router.patch('/:id', async(req, res, next) => postsController.editQuery(req, res))

module.exports = router;