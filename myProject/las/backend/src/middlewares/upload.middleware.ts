import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 视频存储配置
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const videosDir = path.join(uploadDir, 'videos');
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }
    cb(null, videosDir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 图片存储配置
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imagesDir = path.join(uploadDir, 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 文件过滤器
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.fieldname === 'video') {
    // 允许的视频类型
    const allowedMimes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的视频格式。请上传mp4, mpeg, mov或avi格式的视频。'));
    }
  } else if (file.fieldname === 'image' || file.fieldname === 'avatar') {
    // 允许的图片类型
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的图片格式。请上传jpg, png, gif或webp格式的图片。'));
    }
  } else {
    cb(null, false);
  }
};

// 视频上传配置
export const videoUpload = multer({
  storage: videoStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500 // 500MB
  }
});

// 图片上传配置
export const imageUpload = multer({
  storage: imageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  }
});

// 错误处理中间件
export const handleUploadError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '文件大小超出限制' });
    }
    return res.status(400).json({ message: `上传错误: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}; 