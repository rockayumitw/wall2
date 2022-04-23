const handleSuccess = require('../handles/scuessHandle');
const handleError = require('../handles/errorHandle');

// model 載入
const Post = require('../models/posts');

const posts = {
    // 取得列表
    async get(req, res) {
        const data = await Post.find();
        handleSuccess(res, data, "撈取成功")
    },
    // 新增
    async create(req, res) {
        const data = req.body
        const arg = ['name', 'tags', 'type', 'content']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        if(result.length > 0) {
            handleError(res);
            return;
        }
        const post = await Post.create({
            name: data.name,
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
        const id = req.params.id
        const result = await Post.findByIdAndDelete(id);
        const posts = await Post.find();
        result == null ? handleError(res, '無此筆id') : handleSuccess(res, posts, "刪除成功")
    },
    // 編輯 -單筆
    async editQuery(req, res) {
        try {
            const id = req.params.id
            const data = req.body
            const arg = ['name', 'tags', 'type', 'content']
            const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
            if(result.length > 0) {
                handleError(res);
                return;
            }
            const posts = await Post.findByIdAndUpdate(id, data, { new: true});
            if(posts == null) handleError(res)
            else handleSuccess(res, posts)
        } catch (error) {
            console.log()
            if(error.messageFormat == undefined) handleError(res, '無此筆id')
        }
    }
}

module.exports = posts;