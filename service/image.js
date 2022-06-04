const path = require('path');
const multer = require('multer');

// 類似守門員概念, 檔各種資料
const upload = multer({
    limits: {
        fileSize: 2*1024*1024 // 限定2MB
    },
    fileFilter(req, file, cb) {
        // cb 想像成middleware
        const ext = path.extname(file.originalname).toLowerCase();
        if(ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
            cb(new Error('檔案格式錯誤, 僅限上傳 jpg、jpeg 與 png格式。'))
        }
        // true=> 可進入下個middleware
        cb(null, true)
    }
}).any();
// any => 所有檔案都接收

module.exports = upload