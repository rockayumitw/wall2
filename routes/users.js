const express =  require('express');
const router = express.Router();
const usersController = require('../controllers/users');

const handleErrorAsync = require("../service/handleErrorAsync");

// 取得所有列表
// 網址範例: http://localhost:3000/users

/**
 * #swagger.tags = ['Users']
 */

router.get('/', handleErrorAsync(async (req, res, next) => usersController.get(req, res, next)));

// 取得 -單筆
router.get('/:id', handleErrorAsync(async (req, res, next) => usersController.getQuery(req, res, next)));

// 新增
router.post('/', handleErrorAsync(async (req, res, next) => usersController.create(req, res, next)));

// 刪除 -全部
router.delete('/', handleErrorAsync(async (req, res, next) => usersController.delete(req, res, next)))

// 刪除 -單筆
router.delete('/:id', handleErrorAsync(async (req, res, next) => usersController.deleteQuery(req, res, next)))

// 編輯 -單筆
router.patch('/:id', handleErrorAsync(async(req, res, next) => usersController.editQuery(req, res, next)))

// 編輯 -單筆(重設密碼)
router.patch('/:id/resetPassword', handleErrorAsync(async(req, res, next) => usersController.resetPassword(req, res, next)))

module.exports = router;