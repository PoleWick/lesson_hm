"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.imageUpload = exports.videoUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
// 确保上传目录存在
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// 视频存储配置
const videoStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const videosDir = path_1.default.join(uploadDir, 'videos');
        if (!fs_1.default.existsSync(videosDir)) {
            fs_1.default.mkdirSync(videosDir, { recursive: true });
        }
        cb(null, videosDir);
    },
    filename: (req, file, cb) => {
        // 生成唯一文件名
        const uniqueSuffix = `${Date.now()}-${crypto_1.default.randomBytes(6).toString('hex')}`;
        cb(null, `video-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
// 图片存储配置
const imageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const imagesDir = path_1.default.join(uploadDir, 'images');
        if (!fs_1.default.existsSync(imagesDir)) {
            fs_1.default.mkdirSync(imagesDir, { recursive: true });
        }
        cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${crypto_1.default.randomBytes(6).toString('hex')}`;
        cb(null, `image-${uniqueSuffix}${path_1.default.extname(file.originalname)}`);
    }
});
// 文件过滤器
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'video') {
        // 允许的视频类型
        const allowedMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('不支持的视频格式。请上传mp4, mpeg, mov或avi格式的视频。'));
        }
    }
    else if (file.fieldname === 'image' || file.fieldname === 'avatar') {
        // 允许的图片类型
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('不支持的图片格式。请上传jpg, png, gif或webp格式的图片。'));
        }
    }
    else {
        cb(null, false);
    }
};
// 视频上传配置
exports.videoUpload = (0, multer_1.default)({
    storage: videoStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 500 // 500MB
    }
});
// 图片上传配置
exports.imageUpload = (0, multer_1.default)({
    storage: imageStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});
// 错误处理中间件
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: '文件大小超出限制' });
        }
        return res.status(400).json({ message: `上传错误: ${err.message}` });
    }
    else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};
exports.handleUploadError = handleUploadError;
