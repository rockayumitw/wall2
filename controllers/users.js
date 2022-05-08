const handleSuccess = require('../handles/scuessHandle');
const handleError = require('../handles/errorHandle');
const appError = require('../service/appError');

// model 載入
const User = require('../models/users');

const users = {
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
    // 新增
    async create(req, res, next) {
        const data = req.body
        const arg = ['name', 'email', 'password']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        if(result.length > 0) {
            return next(appError(400, `${result.toString()} 欄位不正確`, next));
        }
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            image: data.image,
            createAt: data.createAt,
        });
        handleSuccess(res, user, "新增成功")
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
    // 編輯 -單筆(重設密碼)
    async resetPassword(req, res, next) {
        const id = req.params.id
        const data = req.body
        const arg = ['user_id', 'password']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)

        if(result.length > 0) {
            return next(appError(400, `${result.toString()} 欄位不正確`, next));
        }
        // 撈取使用者資料並替換密碼
        console.log(data)
        const users = await User.findByIdAndUpdate(id, data, { new: true});
        if(users == null) next(appError(400, `${res} 欄位不正確`, next));
        else handleSuccess(res, users)
    },
}

module.exports = users;
