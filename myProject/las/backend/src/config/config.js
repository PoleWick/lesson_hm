"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
exports.config = {
    // 服务器配置
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    // 数据库配置
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        name: process.env.DB_NAME || 'video_social',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        dialect: process.env.DB_DIALECT || 'mysql'
    },
    // JWT配置
    jwtSecret: process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret-key',
    jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-key',
    jwtExpire: process.env.ACCESS_TOKEN_EXPIRE || '1h',
    jwtRefreshExpire: process.env.REFRESH_TOKEN_EXPIRE || '7d',
    // 文件上传配置
    upload: {
        basePath: process.env.UPLOAD_PATH || 'uploads',
        maxSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
        avatarPath: 'avatars',
        videoPath: 'videos',
        imagePath: 'images',
        defaultAvatar: 'default.png'
    },
    // CORS配置
    corsOrigin: process.env.CORS_ORIGIN || '*',
    // 安全配置
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
    // 前端URL
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
