const express =  require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const handleErrorAsync = require("../service/handleErrorAsync");

const { isAuth } = require('../service/auth');

/**
 * #swagger.tags = ['Users']
 */

// 註冊
router.post('/sign_up', handleErrorAsync(async (req, res, next) => usersController.signup(req, res, next)));

// 登入
router.post('/sign_in', handleErrorAsync(async (req, res, next) =>  usersController.signIn(req, res, next)));

// 取得 -單筆
router.get('/profile', isAuth, handleErrorAsync(async (req, res, next) => usersController.getProfile(req, res, next)));

// 編輯 -單筆
router.patch('/profile', isAuth, handleErrorAsync(async(req, res, next) => usersController.updateProfile(req, res, next)))

// 重設密碼
router.post('/updatePassword', isAuth, handleErrorAsync(async(req, res, next) => usersController.updatePassword(req, res, next)))

// 取得對方資訊
router.get('/:id', isAuth, handleErrorAsync(async(req, res, next) => usersController.getUserInfo(req, res, next)))

// 追蹤
router.post('/:id/follow', isAuth, handleErrorAsync(async(req, res, next) => usersController.follow(req, res, next)))

// 取消追蹤
router.delete('/:id/unfollow', isAuth, handleErrorAsync(async(req, res, next) => usersController.unFollow(req, res, next)))


module.exports = router;