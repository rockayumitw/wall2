const handleSuccess = require('../handles/scuessHandle');
const handleError = require('../handles/errorHandle');
const appError = require('../service/appError');

// model 載入
const Post = require('../models/posts');
const User = require('../models/users'); // 如果有使用populate 載入ref 則要一併載入
const Replies = require('../models/replies');
const Comment = require('../models/comments');

const posts = {
    // 全部
    async get(req, res, next) {
        const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
        const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
        const data = await Post.find(q).populate({
            path: 'user',
            select: 'name image sex'
          }).populate({
            path: 'comments',
            select: 'comment user'
          }).sort(timeSort);
        handleSuccess(res, data, "撈取成功")
    },
    async query (res, data, next){
        const id = req.params.id
        data = await Post.find(id)
        handleSuccess(res, data, "撈取成功")
    },
    // 新增
    async create(req, res, next) {
        const data = req.body
        const arg = ['tags', 'type', 'content']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        
        if(result.length > 0) {
            return next(appError(400, `${result.toString()} 欄位不正確`, next));
        }
        const post = await Post.create({
            user: req.user.id, // 如果不是使用req.use.id取得id, populate會關聯不到
            tags: data.tags,
            type: data.type,
            image: data.image,
            createAt: data.createAt,
            content: data.content
        });
        handleSuccess(res, post, "新增成功")
    },
    // 刪除 -全部
    async delete(req, res, next) {
        await Post.deleteMany({});
        const posts = await Post.find();
        handleSuccess(res, posts, "刪除成功")
    },
    // 刪除 -單筆
    async deleteQuery(req, res, next) {
        const id = req.params.id
        const result = await Post.findByIdAndDelete(id);
        const posts = await Post.find();
        result == null ? next(appError(400, `無此筆id`, next)) : handleSuccess(res, posts, "刪除成功")
    },
    // 編輯 -單筆
    async editQuery(req, res, next) {
        const id = req.params.id
        const data = req.body
        const arg = ['name', 'tags', 'type', 'content']
        const result = await arg.filter(key => data[key] == '' || data[key] == undefined)
        if(result.length > 0) {
            return next(appError(400, `${result.toString()} 欄位不正確`, next))
        }
        const posts = await Post.findByIdAndUpdate(id, data, { new: true});
        if(posts == null) next(appError(400, `${res} `, next))
        else handleSuccess(res, posts)
    },
    // 點讚
    async postLikes(req, res, next) {
        const _id = req.params.id;
        // $addToSet: 如果裡面有一模一樣的id, 則不推
        await Post.findOneAndUpdate({ _id}, {
            $addToSet: {
                likes: req.user.id
            }
        });
        res.status(201).json({
            status: 'success',
            postId: _id,
            userId: req.user.id
        })
    },
    // 刪除讚
    async deleteLikes(req, res, next) {
        const _id = req.params.id;
        // $pull: 如果陣列裡面有相同則移除
        await Post.findOneAndUpdate({_id}, {
            $pull: {
                likes: req.user.id
            }
        });
        res.status(201).json({
            status: 'success',
            postId: _id,
            userId: req.user.id
        })
    },
    // 取得點讚列表
    async getLikeList(req, res, next) {
        // $in 尋找陣列有沒有相同的資料
        const likeList = await Post.find({
            likes: {
                $in: [req.user.id]
            }
        }).populate({
            path: "user",
            select: "name _id"
        });
        res.status(200).json({
            status: 'success',
            likeList
        })
    },
    // 留言
    async addComment(req, res, next) {
        const user = req.user.id
        const post = req.params.id
        const {comment} = req.body
        const newComment = await Comment.create({
            post,
            user,
            comment
        })
        // const posts = await Post.find({
        //     user
        // }).populate({
        //     path: 'comment',
        //     results: posts.length,
        //     posts
        // })
        res.status(200).json({
            status: 'success',
            data: {
                comments: newComment
            }
        })
    }
}

module.exports = posts;