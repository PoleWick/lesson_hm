"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverError = exports.error = exports.successWithPagination = exports.success = void 0;
/**
 * 成功响应
 * @param res Express响应对象
 * @param data 响应数据
 * @param message 成功消息
 * @param code HTTP状态码
 */
const success = (res, data, message = '操作成功', code = 200) => {
    const response = {
        success: true,
        message,
        data,
        timestamp: Date.now()
    };
    return res.status(code).json(response);
};
exports.success = success;
/**
 * 带分页的成功响应
 * @param res Express响应对象
 * @param data 响应数据
 * @param total 总记录数
 * @param currentPage 当前页码
 * @param pageSize 每页大小
 * @param message 成功消息
 */
const successWithPagination = (res, data, total, currentPage, pageSize, message = '操作成功') => {
    const totalPages = Math.ceil(total / pageSize);
    const response = {
        success: true,
        message,
        data,
        pagination: {
            total,
            currentPage,
            totalPages,
            pageSize
        },
        timestamp: Date.now()
    };
    return res.status(200).json(response);
};
exports.successWithPagination = successWithPagination;
/**
 * 错误响应
 * @param res Express响应对象
 * @param message 错误消息
 * @param code HTTP状态码
 */
const error = (res, message = '操作失败', code = 400) => {
    const response = {
        success: false,
        message,
        timestamp: Date.now()
    };
    return res.status(code).json(response);
};
exports.error = error;
/**
 * 服务器错误响应
 * @param res Express响应对象
 * @param err 错误对象
 */
const serverError = (res, err) => {
    console.error('服务器错误:', err);
    const isDev = process.env.NODE_ENV === 'development';
    const message = isDev ? err.message : '服务器内部错误';
    const response = {
        success: false,
        message,
        timestamp: Date.now()
    };
    if (isDev) {
        // @ts-ignore
        response.stack = err.stack;
    }
    return res.status(500).json(response);
};
exports.serverError = serverError;
