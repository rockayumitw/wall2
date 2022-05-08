const appError = (httpStatus, errMessage, next) => {
    const error = new Error(errMessage);
    error.statusCode = httpStatus;
    error.isOperational = true;
    next(error); // 統一攜帶會進到app.js的 error 錯誤處理
}

module.exports = appError;