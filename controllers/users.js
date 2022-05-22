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
        console.log('是否有近來')
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
        password = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create({
            email,
            password,
            name
        });
        generateSendJWT(newUser, 201, res);
        handleSuccess(res, user, "註冊成功")
    },
    // 登入
    async signIn(req, res,next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(appError(400, '帳號密碼不可為空', next));
        }
        // 取得信箱
        // .select('+password'), 原本預設資料庫回傳是沒有開啟, 如果想要開啟則可以加這一行
        const user = await User.findOne({email}).select('+password');
        // 比較
        const auth = await bcrypt.compare(password, user.password);
        if(!auth){
            return next(appError(400, '您的密碼不正確', next));
        }
        generateSendJWT(user, 200, res)
    },
    // 取得使用者所有資訊
    async get(req, res, next) {
        const data = await User.find();
        handleSuccess(res, data, "撈取成功")
    },
    // 取得 -單筆
    async getQuery(req, res, next) {
        const id = req.params.id
        const user = await User.find({
            _id: id
        })
        return (user.length != 0 ) ? handleSuccess(res, user, "撈取成功") : next(appError(400, `無此id`, next));
    },
    // 刪除 -全部
    async delete(req, res) {
        await User.deleteMany({});
        const users = await User.find();
        handleSuccess(res, users, "刪除成功")
    },
    // 刪除 -單筆
    async deleteQuery(req, res, next) {
        const id = req.params.id
        // const result = await User.findByIdAndDelete(id);
        const result = await User.deleteOne({user_id: id})
        const users = await User.find();
        return result == null ? next(appError(400, `無此筆id`, next)) :  handleSuccess(res, users, "刪除成功")
    },
    // 編輯 -單筆(暱稱修改)
    async editQuery(req, res, next) {
        const id = req.params.id
        const data = req.body
        const arg = ['name', 'sex']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)

        if(result.length > 0) {
            return next(appError(400, `${result.toString()} 欄位不正確`, next));
        }

        const users = await User.findByIdAndUpdate(id, data, { new: true});
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

        // const id = req.params.id
        // const data = req.body
        // const arg = ['user_id', 'password']
        // const result = await arg.filter(key => data[key] == '' || data[key] == undefined)

        // if(result.length > 0) {
        //     return next(appError(400, `${result.toString()} 欄位不正確`, next));
        // }
        // // 撈取使用者資料並替換密碼
        // console.log(data)
        // const users = await User.findByIdAndUpdate(id, data, { new: true});
        // if(users == null) next(appError(400, `${res} 欄位不正確`, next));
        // else handleSuccess(res, users)
    },
    // 編輯 -單筆(重設密碼)
    // async resetPassword(req, res, next) {
    //     const id = req.params.id
    //     const data = req.body
    //     const arg = ['user_id', 'password']
    //     const result = await arg.filter(key => data[key] == '' || data[key] == undefined)

    //     if(result.length > 0) {
    //         return next(appError(400, `${result.toString()} 欄位不正確`, next));
    //     }
    //     // 撈取使用者資料並替換密碼
    //     console.log(data)
    //     const users = await User.findByIdAndUpdate(id, data, { new: true});
    //     if(users == null) next(appError(400, `${res} 欄位不正確`, next));
    //     else handleSuccess(res, users)
    // },
}

module.exports = users;
