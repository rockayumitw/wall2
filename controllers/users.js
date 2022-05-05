const handleSuccess = require('../handles/scuessHandle');
const handleError = require('../handles/errorHandle');

// model 載入
const User = require('../models/users');

const users = {
    // 取得使用者所有資訊
    async get(req, res) {
        try {
            const data = await User.find();
            handleSuccess(res, data, "撈取成功")
        } catch(e) {
            console.log(e)
        }
        
    },
    // 取得 -單筆
    async getQuery(req, res) {
        const id = req.params.id
        try {
            const user = await User.find({
                user_id: id
            })
            handleSuccess(res, user, "撈取成功")
        } catch(e) {
            handleError(res, err.message);
        }
    },
    // 新增
    async create(req, res) {
        const data = req.body
        const arg = ['name', 'email', 'password']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        if(result.length > 0) {
            handleError(res, `${result.toString()} 欄位不正確`);
            return;
        }
        try{
            const user = await User.create({
                name: data.name,
                email: data.email,
                password: data.password,
                image: data.image,
                createAt: data.createAt,
            });
            handleSuccess(res, user, "新增成功")
        } catch(err) {
            handleError(res, err.message);
        }
    },
    // 刪除 -全部
    async delete(req, res) {
        await User.deleteMany({});
        const users = await User.find();
        handleSuccess(res, users, "刪除成功")
    },
    // 刪除 -單筆
    async deleteQuery(req, res) {
        try{
            const id = req.params.id
            // const result = await User.findByIdAndDelete(id);
            const result = await User.deleteOne({user_id: id})
            const users = await User.find();
            result == null ? handleError(res, '無此筆id') :  handleSuccess(res, users, "刪除成功")  
        } catch(error) {
            console.log(error)
            if(error.messageFormat == undefined) handleError(res, '無此筆id')
        }
    },
    // 編輯 -單筆(暱稱修改)
    async editQuery(req, res) {
        try {
            const id = req.params.id
            const data = req.body
            const arg = ['name', 'sex']
            const result = await arg.filter(key => data[key] == '' || data[key] == undefined)

            if(result.length > 0) {
                handleError(res, `${result.toString()} 欄位不正確`);
                return;
            }

            const users = await User.findByIdAndUpdate(id, data, { new: true});
            if(users == null) handleError(res)
            else handleSuccess(res, users)
        } catch (error) {
            if(error.messageFormat == undefined) handleError(res, '無此筆id')
        }
    },
    // 編輯 -單筆(重設密碼)
    async resetPassword(req, res) {
        try {
            const id = req.params.id
            const data = req.body

            const arg = ['user_id', 'password']
            const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
            console.log(result)
            
            // 需要多個判斷 是否要回每個錯誤狀態
            if(result.length > 0) {
                handleError(res, `${result.toString()} 欄位不正確`);
                return;
            }
            // 撈取使用者資料並替換密碼
            console.log(data)
            const users = await User.findByIdAndUpdate(id, data, { new: true});
            if(users == null) handleError(res)
            else handleSuccess(res, users)
        } catch (error) {
            if(error.messageFormat == undefined) handleError(res, '無此筆id')
        }
        handleSuccess(res, users)
    },
}

module.exports = users;
