"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
// 获取JWT配置
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'accessTokenSecret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshTokenSecret';
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE || '1h';
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE || '7d';
/**
 * 生成访问令牌
 * @param payload 令牌载荷
 * @returns 生成的JWT访问令牌
 */
const generateAccessToken = (payload) => {
    const options = { expiresIn: accessTokenExpire };
    return jsonwebtoken_1.default.sign(payload, accessTokenSecret, options);
};
exports.generateAccessToken = generateAccessToken;
/**
 * 生成刷新令牌
 * @param payload 令牌载荷
 * @returns 生成的JWT刷新令牌
 */
const generateRefreshToken = (payload) => {
    const options = { expiresIn: refreshTokenExpire };
    return jsonwebtoken_1.default.sign(payload, refreshTokenSecret, options);
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * 验证访问令牌
 * @param token JWT访问令牌
 * @returns 解码后的载荷或null（如果验证失败）
 */
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, accessTokenSecret);
    }
    catch (error) {
        console.error('访问令牌验证失败:', error);
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * 验证刷新令牌
 * @param token JWT刷新令牌
 * @returns 解码后的载荷或null（如果验证失败）
 */
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, refreshTokenSecret);
    }
    catch (error) {
        console.error('刷新令牌验证失败:', error);
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * 为用户生成访问令牌和刷新令牌
 * @param payload 用户信息载荷
 * @returns 包含访问令牌和刷新令牌的对象
 */
const generateTokens = (payload) => {
    return {
        accessToken: (0, exports.generateAccessToken)(payload),
        refreshToken: (0, exports.generateRefreshToken)(payload)
    };
};
exports.generateTokens = generateTokens;
