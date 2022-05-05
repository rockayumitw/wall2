const handleSuccess = require('../handles/scuessHandle');
const handleError = require('../handles/errorHandle');

// model 載入
const Post = require('../models/posts');
const User = require('../models/users');
const Replies = require('../models/replies');

const posts = {
    // 取得列表
    async get(req, res) {
        // populate => 合併user欄位資料
        // select => 要顯示哪幾筆資料
        try{
            let sort = req.body.sort;
            let search = req.body.content;
            let data = '';
            if(sort == undefined) sort = -1
            if(search == undefined) search = ''
            if(search == '') {
                data = await Post.find().sort({createAt: sort}).populate({
                    path: 'user',
                    select: 'name image sex'
                }).populate({
                    path: 'replies',
                    select: 'user content'
                });
            } else {
                data = await Post.find({
                    content: {$regex: search}
                }).sort({createAt: sort}).populate({
                    path: 'user',
                    select: 'name image sex'
                }).populate({
                    path: 'replies',
                    select: 'user content'
                });
            }
            handleSuccess(res, data, "撈取成功")
        } catch(err) {
            console.log(err)
            handleError(res, err.message);
        } 
    },
    // 新增
    async create(req, res) {
        const data = req.body
        console.log(data)
        const arg = ['user_id', 'tags', 'type', 'content']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        if(result.length > 0) {
            handleError(res, `${result.toString()} 欄位不正確`);
            return;
        }
        const post = await Post.create({
            user: data.user_id,
            tags: data.tags,
            type: data.type,
            image: data.image,
            createAt: data.createAt,
            content: data.content,
            likes: data.likes,
            comments: data.comments
        });
        handleSuccess(res, post, "新增成功")
    },
    // 刪除 -全部
    async delete(req, res) {
        await Post.deleteMany({});
        const posts = await Post.find();
        handleSuccess(res, posts, "刪除成功")
    },
    // 刪除 -單筆
    async deleteQuery(req, res) {
        try{
            const id = req.params.id
            const result = await Post.findByIdAndDelete(id);
            const posts = await Post.find();
            result == null ? handleError(res, '無此筆id') : handleSuccess(res, posts, "刪除成功")
        } catch(error) {
            if(error.messageFormat == undefined) handleError(res, '無此筆id')
        }
    },
    // 編輯 -單筆
    async editQuery(req, res) {
        try {
            const id = req.params.id
            const data = req.body
            const arg = ['name', 'tags', 'type', 'content']
            const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
            if(result.length > 0) {
                handleError(res, `${result.toString()} 欄位不正確`);
                return;
            }
            const posts = await Post.findByIdAndUpdate(id, data, { new: true});
            if(posts == null) handleError(res)
            else handleSuccess(res, posts)
        } catch (error) {
            if(error.messageFormat == undefined) handleError(res, '無此筆id')
        }
    }
}

module.exports = posts;