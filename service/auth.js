const jwt = require('jsonwebtoken');
const appError = require('../service/appError');
const handleErrorAsync = require("../service/handleErrorAsync");

// model 載入
const User = require('../models/users');

// 是否登入
// isAuth, isAdmin
const isAuth = handleErrorAsync(async (req, res, next) => {
    // 確認token是否存在
    let token;
    // 判斷前端帶入的authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Bearer 後面的空白做切割
        token = req.headers.authorization.split(' ')[1];
        console.log(token)
    }

    if(!token) {
        return next(appError(401, '您尚未登入', next))
    }

    // 解密: 驗證 token 是否正確 (不需要進到資料庫即可驗證是否正確)
    // 簽證過後, token都會過期
    const decoded = await new Promise((resolve, reject) => {
        // 參數1: 前端帶入的token
        // 參數2: 帶入環境變數的混淆密碼
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => err ? reject(err) : resolve(payload))
    })
    
    // 資料庫寫在最後面
    const currentUser = await User.findById(decoded.id);
    // req 自訂屬性
    req.user = currentUser;
    next();
})

// 簽證
const generateSendJWT = (user, statusCode, res) => {
    // 產生 JWT token
    // sign: 簽證
    // 參數1: PAYLOAD(存放甚麼資料進去(如: 使用者id)), 
    // 參數2: 放甚麼資訊(編碼)進去混淆, 
    // 參數3: 自訂選項(如: 過期時間)
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY
    });

    user.password = undefined;
    
    res.status(statusCode).json({
        status: 'success',
        user: {
            token,
            name: user.name
        }
    })
}

module.exports = {
    isAuth,
    generateSendJWT
}