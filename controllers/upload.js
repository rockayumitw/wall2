const handleSuccess = require('../handles/scuessHandle');
const appError = require("../service/appError");
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');


const uploadImage = {
    // 將資料包裝成buffer chunk格式
    async upload(req, res, next) {
        console.log(req.files)
        if(!req.files.length) {
            return next(appError(400, '尚未上傳檔案', next))
        }

        // 高寬套件
        // const dimensions = sizeOf(req.files[0].buffer);
        // if(dimensions.with !== dimensions.height) {
        //     return next(appError(400, '圖片長寬不符合1:1 尺寸。', next))
        // }

        const client = new ImgurClient({
            clientId: process.env.IMGUR_CLIENTID,
            clientSecret: process.env.IMGUR_CLIENT_SECRET,
            refreshToken: process.env.IMGUR_REFRESH_TOKEN
        })

        // 拿出buffer 轉成 base64
        const response = await client.upload({
            image: req.files[0].buffer.toString('base64'),
            type: 'base64',
            album: process.env.IMGUR_ALBUM_ID
        })

        handleSuccess(res, response.data.link, "新增成功")
    }
}

module.exports = uploadImage;