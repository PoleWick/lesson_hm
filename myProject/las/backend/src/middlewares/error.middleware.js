"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = exports.errorStatus = exports.ApiError = void 0;
// 自定义API错误类
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
// 定义常用错误状态
exports.errorStatus = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER: 500
};
// 404错误处理
const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `找不到 - ${req.originalUrl}`);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
// 全局错误处理中间件
const errorHandler = (err, req, res, next) => {
    console.error('错误详情:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        return;
    }
    // 处理Sequelize错误
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({
            success: false,
            message: '数据验证错误',
            errors: err.errors.map((e) => ({
                field: e.path,
                message: e.message
            }))
        });
        return;
    }
    // 返回通用服务器错误
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
exports.errorHandler = errorHandler;
