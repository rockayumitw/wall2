const handleSuccess = require('../handles/scuessHandle');
const handleError = require('../handles/errorHandle');

// model 載入
const Post = require('../models/posts');
const User = require('../models/users');
const Reply = require('../models/replies');

const replies = {
    // 取得單一回覆
    // async getQuery(req, res) {
    //     // populate => 合併user欄位資料
    //     // select => 要顯示哪幾筆資料
    //     try{
    //         const data = await Reply.find()
    //         handleSuccess(res, data, "撈取成功")
    //     } catch(err) {
    //         console.log(err)
    //         handleError(res, err.message);
    //     } 
    // },
    /**
     * #swagger.ignore = true
     */
    // 新增回覆
    async create(req, res) {
        const data = req.body
        const arg = ['user_id', 'post_id', 'content']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        if(result.length > 0) {
            handleError(res, `${result.toString()} 欄位不正確`);
            return;
        }
        const post = await Reply.create({
            user: data.user_id,
            post: data.post_id,
            createAt: data.createAt,
            content: data.content,
        });
        handleSuccess(res, post, "新增成功")
    },
}

module.exports = replies;