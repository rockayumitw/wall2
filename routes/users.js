const express =  require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const handleErrorAsync = require("../service/handleErrorAsync");

const { isAuth } = require('../service/auth');

// 取得所有列表
// 網址範例: http://localhost:3000/users

/**
 * #swagger.tags = ['Users']
 */

// 註冊
router.post('/sign_up', handleErrorAsync(async (req, res, next) => usersController.signup(req, res, next)));

// 登入
router.post('/sign_in', handleErrorAsync(async (req, res, next) =>  usersController.signup(req, res, next)));

router.get('/', handleErrorAsync(async (req, res, next) => usersController.get(req, res, next)));

// 取得 -單筆
router.get('/:id', handleErrorAsync(async (req, res, next) => usersController.getQuery(req, res, next)));

// 刪除 -全部
router.delete('/', handleErrorAsync(async (req, res, next) => usersController.delete(req, res, next)))

// 刪除 -單筆
router.delete('/:id', handleErrorAsync(async (req, res, next) => usersController.deleteQuery(req, res, next)))

// 編輯 -單筆
router.patch('/:id', handleErrorAsync(async(req, res, next) => usersController.editQuery(req, res, next)))

// 重設密碼
router.post('/updatePassword',isAuth ,handleErrorAsync(async(req, res, next) => usersController.updatePassword(req, res, next)))


module.exports = router;