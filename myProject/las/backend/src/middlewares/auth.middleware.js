"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyRefreshToken = exports.optionalToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const jwt_utils_1 = require("../utils/jwt.utils");
const apiResponse_1 = require("../utils/apiResponse");
/**
 * 验证请求头中的JWT令牌
 * 如果有效，将解码后的用户信息添加到req.user
 */
const verifyToken = (req, res, next) => {
    try {
        // 从请求头获取Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return (0, apiResponse_1.error)(res, '未提供访问令牌', 401);
        }
        // 检查令牌格式
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return (0, apiResponse_1.error)(res, '访问令牌格式无效', 401);
        }
        const token = parts[1];
        const payload = (0, jwt_utils_1.verifyAccessToken)(token);
        if (!payload) {
            return (0, apiResponse_1.error)(res, '访问令牌无效或已过期', 401);
        }
        // 将用户信息添加到请求对象
        req.user = payload;
        // 继续下一个中间件
        next();
    }
    catch (err) {
        console.error('令牌验证失败:', err);
        return (0, apiResponse_1.error)(res, '令牌验证失败', 401);
    }
};
exports.verifyToken = verifyToken;
/**
 * 可选的令牌验证
 * 如果令牌有效，将用户信息添加到req.user
 * 如果没有令牌或令牌无效，仍然继续处理请求
 */
const optionalToken = (req, res, next) => {
    try {
        // 从请求头获取Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next();
        }
        // 检查令牌格式
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return next();
        }
        const token = parts[1];
        const payload = (0, jwt_utils_1.verifyAccessToken)(token);
        if (payload) {
            // 将用户信息添加到请求对象
            req.user = payload;
        }
        // 继续下一个中间件
        next();
    }
    catch (err) {
        // 即使验证失败也继续处理请求
        next();
    }
};
exports.optionalToken = optionalToken;
// 验证刷新令牌
const verifyRefreshToken = (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: '未提供刷新令牌' });
        }
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshTokenSecret';
        jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: '无效的刷新令牌' });
            }
            // 将解码后的用户信息添加到请求对象
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        console.error('验证刷新令牌错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
// 验证管理员权限
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: '未授权，请先登录' });
        }
        const user = yield User_1.default.findByPk(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: '无权限，需要管理员权限' });
        }
        next();
    }
    catch (error) {
        console.error('验证管理员权限错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.verifyAdmin = verifyAdmin;
