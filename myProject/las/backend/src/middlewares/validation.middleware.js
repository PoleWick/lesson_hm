"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validate = void 0;
const error_middleware_1 = require("./error.middleware");
/**
 * 验证请求数据中间件
 * @param schema Joi验证模式
 * @param property 要验证的请求属性 ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], {
            abortEarly: false, // 收集所有错误
            allowUnknown: true, // 允许未知字段
            stripUnknown: false // 不删除未知字段
        });
        if (!error) {
            return next();
        }
        // 处理验证错误
        const validationErrors = error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message
        }));
        const errorMessage = '数据验证失败';
        // 创建API错误
        const apiError = new error_middleware_1.ApiError(400, errorMessage);
        // @ts-ignore
        apiError.validationErrors = validationErrors;
        return next(apiError);
    };
};
exports.validate = validate;
/**
 * 自定义错误处理函数，将验证错误转换为格式化响应
 */
const handleValidationErrors = (err, req, res, next) => {
    if (err.validationErrors) {
        return res.status(400).json({
            success: false,
            message: err.message,
            errors: err.validationErrors,
            timestamp: Date.now()
        });
    }
    next(err);
};
exports.handleValidationErrors = handleValidationErrors;
