const handleSuccess = require('../handles/scuessHandle');
const appError = require('../service/appError');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { generateSendJWT } = require('../service/auth');

// model 載入
const User = require('../models/users');

const users = {
    // 註冊
    async signup(req, res, next) {
        let {email, password, confirmPassword, name} = req.body;
        // 內容不得為空
        if(!email || !password || !confirmPassword || !name) {
            return next(appError('400', '欄位未填寫正確!', next));
        }
        // 密碼是否一致
        if (password !== confirmPassword) {
            return next(appError('400', '密碼不一致!', next));
        }
        // 密碼8碼以上
        if (!validator.isLength(password, {min:8})) {
            return next(appError('400', '密碼字數低於8碼!', next));
        }
        // email格式是否正確
        if(!validator.isEmail(email)) {
            return next(appError('400', 'email格式不正確!', next));
        }

        // 加密密碼
        password = await bcrypt.hash(req.body.password,12);
        console.log('--加密密碼--')
        console.log(req.body.password)
        console.log(password)

        const newUser = await User.create({
            email,
            password,
            name
        });

        generateSendJWT(newUser, 201, res);
    },
    // 登入
    async signIn(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(appError(400, '帳號密碼不可為空', next));
        }
        // 取得是否有此信箱
        // .select('+password'), 原本預設資料庫回傳是沒有開啟, 如果想要開啟則可以加這一行
        const user = await User.findOne({email}).select('+password');

        // 比較密碼是否正確
        const auth = await bcrypt.compare(password, user.password);

        if(!auth){
            return next(appError(400, '您的密碼不正確', next));
        }
        // 比對正確再產生jwt
        generateSendJWT(user, 200, res)
    },
    // 取得使用者所有資訊
    async getProfile(req, res, next) {
        handleSuccess(res, req.user, "撈取成功")
    },
    // 編輯 -單筆(暱稱修改)
    async updateProfile(req, res, next) {
        const { user } = req
        const data = req.body
        const arg = ['name', 'sex']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)

        if(result.length > 0) {
            return next(appError(400, `${result.toString()} 欄位不正確`, next));
        }

        const users = await User.findByIdAndUpdate(user._id, data, { new: true});
        if(users == null) next(appError(400, `${res}`, next))
        else handleSuccess(res, users)
    },
    // 更新密碼
    async updatePassword(req, res, next) {
        // 1. 先判斷 -nodeJS
        const {password, confirmPassword} = req.body;
        if(password !== confirmPassword) {
            return next(appError('400', '密碼不一致', next));
        }

        // 2. 加密 -nodeJS
        newPassword = await bcrypt.hash(password, 12)

        // 3. 更新密碼 -資料庫
        const user = await User.findByIdAndUpdate(req.user.id, {
            password: newPassword
        });
        generateSendJWT(user, 200, res);
    },
    // 取得使用者資訊
    async getUserInfo(req, res, next) {
        const id = req.params.id
        const posts = await Post.find({
            id
        })
        handleSuccess(res, posts, '撈取成功')
    },
    // 追蹤
    async follow (req, res, next) {
        if (req.params.id == req.user.id) {
            return next(appError(401, '您無法追蹤自己', next))
        }
        await User.updateOne(
            {
                _id: req.user.id,
                'following.user': { $ne: req.params.id }
            },
            {
                $addToSet: { // 有此筆資料就不自動加入
                    following: {
                        user: req.params.id
                    }
                }
            }
        )
        await User.updateOne(
            {
                _id: req.params.id,
                'followers.user': {
                    $ne: req.user.id
                }
            },
            {
                $addToSet: { // 有此筆資料就不自動加入
                    followers: {
                        user: req.params.id
                    }
                }
            }
        )
        res.status(200).json({
            stats: 'success', 
            message: '已追蹤成功!'
        })
    },
    // 不追蹤
    async unFollow(req, res, next) {
        if (req.params.id == req.user.id) {
            return next(appError(401, '您無法取消追蹤自己', next))
        }
        await User.updateOne(
            {
                _id: req.user.id,
            },
            {
                $pull: {
                    following: {
                        user: req.params.id
                    }
                }
            }
        )
        await User.updateOne(
            {
                _id: req.params.id
            },
            {
                $pull: {
                    followers: {
                        user: req.user.id
                    }
                }
            }
        )
        res.status(200).json({
            stats: 'success', 
            message: '取消追蹤成功!'
        })
    }
}

module.exports = users;
