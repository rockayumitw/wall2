const express =  require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// 取得所有列表
// 網址範例: http://localhost:3000/users
router.get('/', async (req, res, next) => usersController.get(req, res));

// 取得 -單筆
router.get('/:id', async (req, res, next) => usersController.getQuery(req, res));

// 新增
router.post('/', async (req, res, next) => usersController.create(req, res));

// 刪除 -全部
router.delete('/', async (req, res, next) => usersController.delete(req, res))

// 刪除 -單筆
router.delete('/:id', async (req, res, next) => usersController.deleteQuery(req, res))

// 編輯 -單筆
router.patch('/:id', async(req, res, next) => usersController.editQuery(req, res))

// 編輯 -單筆(重設密碼)
router.patch('/:id/resetPassword', async(req, res, next) => usersController.resetPassword(req, res))

module.exports = router;