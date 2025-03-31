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
exports.generateVideoCover = exports.generateVideoSummary = exports.getVideoComments = exports.likeVideo = exports.deleteVideo = exports.updateVideo = exports.getVideoById = exports.completeChunkUpload = exports.uploadChunk = exports.initChunkUpload = exports.uploadVideo = exports.getAllVideos = void 0;
const Video_1 = __importDefault(require("../models/Video"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
// 获取所有视频
const getAllVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const { count, rows: videos } = yield Video_1.default.findAndCountAll({
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset
        });
        return res.status(200).json({
            videos,
            totalCount: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum
        });
    }
    catch (error) {
        console.error('获取视频列表错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getAllVideos = getAllVideos;
// 上传视频
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!title) {
            return res.status(400).json({ message: '视频标题不能为空' });
        }
        if (!req.file) {
            return res.status(400).json({ message: '请上传视频文件' });
        }
        const videoFile = req.file;
        const videoUrl = `/uploads/videos/${videoFile.filename}`;
        // 创建视频记录
        const video = yield Video_1.default.create({
            title,
            description: description || '',
            videoUrl,
            userId,
            status: 'processing'
        });
        // 触发异步处理（实际项目中这应该放入队列）
        // processVideo(video.id, videoUrl);
        return res.status(201).json({
            message: '视频上传成功，正在处理中',
            video: {
                id: video.id,
                title: video.title,
                description: video.description,
                status: video.status
            }
        });
    }
    catch (error) {
        console.error('上传视频错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.uploadVideo = uploadVideo;
// 分片上传初始化
const initChunkUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { filename, totalChunks, fileSize } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!filename || !totalChunks || !fileSize) {
            return res.status(400).json({ message: '缺少必要参数' });
        }
        // 生成唯一上传ID
        const uploadId = crypto_1.default.randomBytes(16).toString('hex');
        // 创建临时目录存储分片
        const chunkDir = path_1.default.join(__dirname, '../../uploads/chunks', uploadId);
        if (!fs_1.default.existsSync(chunkDir)) {
            fs_1.default.mkdirSync(chunkDir, { recursive: true });
        }
        // 存储上传信息（实际项目中应该保存到数据库或Redis中）
        // tempUploads[uploadId] = { userId, filename, totalChunks: parseInt(totalChunks), fileSize, receivedChunks: 0 };
        return res.status(200).json({
            uploadId,
            message: '上传初始化成功'
        });
    }
    catch (error) {
        console.error('初始化分片上传错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.initChunkUpload = initChunkUpload;
// 上传分片
const uploadChunk = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { uploadId } = req.params;
        const { chunkNumber } = req.query;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!uploadId || !chunkNumber) {
            return res.status(400).json({ message: '缺少必要参数' });
        }
        if (!req.file) {
            return res.status(400).json({ message: '请上传分片文件' });
        }
        // 验证上传ID是否有效
        // const uploadInfo = tempUploads[uploadId];
        // if (!uploadInfo || uploadInfo.userId !== userId) {
        //   return res.status(404).json({ message: '上传ID无效' });
        // }
        // 保存分片
        const chunkDir = path_1.default.join(__dirname, '../../uploads/chunks', uploadId);
        const chunkPath = path_1.default.join(chunkDir, `chunk-${chunkNumber}`);
        // fs.renameSync(req.file.path, chunkPath);
        // 更新已接收分片数量
        // uploadInfo.receivedChunks += 1;
        return res.status(200).json({
            message: '分片上传成功',
            chunkNumber
        });
    }
    catch (error) {
        console.error('上传分片错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.uploadChunk = uploadChunk;
// 完成分片上传
const completeChunkUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { uploadId } = req.params;
        const { title, description } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!uploadId || !title) {
            return res.status(400).json({ message: '缺少必要参数' });
        }
        // 验证上传ID是否有效
        // const uploadInfo = tempUploads[uploadId];
        // if (!uploadInfo || uploadInfo.userId !== userId) {
        //   return res.status(404).json({ message: '上传ID无效' });
        // }
        // // 验证所有分片是否上传完成
        // if (uploadInfo.receivedChunks !== uploadInfo.totalChunks) {
        //   return res.status(400).json({ 
        //     message: '分片上传尚未完成',
        //     receivedChunks: uploadInfo.receivedChunks,
        //     totalChunks: uploadInfo.totalChunks
        //   });
        // }
        // 合并分片
        const chunkDir = path_1.default.join(__dirname, '../../uploads/chunks', uploadId);
        const videosDir = path_1.default.join(__dirname, '../../uploads/videos');
        if (!fs_1.default.existsSync(videosDir)) {
            fs_1.default.mkdirSync(videosDir, { recursive: true });
        }
        // 生成最终文件名
        const fileExt = path_1.default.extname(req.body.filename || 'video.mp4');
        const finalFilename = `video-${Date.now()}-${crypto_1.default.randomBytes(6).toString('hex')}${fileExt}`;
        const finalPath = path_1.default.join(videosDir, finalFilename);
        // const writeStream = fs.createWriteStream(finalPath);
        // 按顺序合并分片
        // for (let i = 1; i <= uploadInfo.totalChunks; i++) {
        //   const chunkPath = path.join(chunkDir, `chunk-${i}`);
        //   const chunkBuffer = fs.readFileSync(chunkPath);
        //   writeStream.write(chunkBuffer);
        //   fs.unlinkSync(chunkPath); // 删除分片
        // }
        // writeStream.end();
        // 删除临时目录
        // fs.rmdirSync(chunkDir);
        // 删除上传信息
        // delete tempUploads[uploadId];
        // 创建视频记录
        const video = yield Video_1.default.create({
            title,
            description: description || '',
            videoUrl: `/uploads/videos/${finalFilename}`,
            userId,
            status: 'processing'
        });
        // 触发异步处理（实际项目中这应该放入队列）
        // processVideo(video.id, finalPath);
        return res.status(201).json({
            message: '视频上传成功，正在处理中',
            video: {
                id: video.id,
                title: video.title,
                description: video.description,
                status: video.status
            }
        });
    }
    catch (error) {
        console.error('完成分片上传错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.completeChunkUpload = completeChunkUpload;
// 获取单个视频详情
const getVideoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = parseInt(req.params.id);
        const video = yield Video_1.default.findByPk(videoId, {
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });
        if (!video) {
            return res.status(404).json({ message: '视频不存在' });
        }
        // 增加观看次数
        video.views += 1;
        yield video.save();
        return res.status(200).json({ video });
    }
    catch (error) {
        console.error('获取视频详情错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getVideoById = getVideoById;
// 更新视频信息
const updateVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const videoId = parseInt(req.params.id);
        const { title, description } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!title) {
            return res.status(400).json({ message: '视频标题不能为空' });
        }
        const video = yield Video_1.default.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: '视频不存在' });
        }
        // 验证用户是否有权限修改
        if (video.userId !== userId) {
            return res.status(403).json({ message: '无权修改该视频' });
        }
        // 更新视频信息
        video.title = title;
        video.description = description || '';
        yield video.save();
        return res.status(200).json({
            message: '视频信息更新成功',
            video
        });
    }
    catch (error) {
        console.error('更新视频信息错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.updateVideo = updateVideo;
// 删除视频
const deleteVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const videoId = parseInt(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const video = yield Video_1.default.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: '视频不存在' });
        }
        // 验证用户是否有权限删除
        if (video.userId !== userId) {
            return res.status(403).json({ message: '无权删除该视频' });
        }
        // 删除视频文件
        const videoPath = path_1.default.join(__dirname, '../..', video.videoUrl);
        if (fs_1.default.existsSync(videoPath)) {
            fs_1.default.unlinkSync(videoPath);
        }
        // 删除封面文件（如果有）
        if (video.coverUrl) {
            const coverPath = path_1.default.join(__dirname, '../..', video.coverUrl);
            if (fs_1.default.existsSync(coverPath)) {
                fs_1.default.unlinkSync(coverPath);
            }
        }
        // 删除视频记录
        yield video.destroy();
        return res.status(200).json({ message: '视频已删除' });
    }
    catch (error) {
        console.error('删除视频错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.deleteVideo = deleteVideo;
// 点赞视频
const likeVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = parseInt(req.params.id);
        const video = yield Video_1.default.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: '视频不存在' });
        }
        // 增加点赞数
        video.likes += 1;
        yield video.save();
        return res.status(200).json({
            message: '点赞成功',
            likes: video.likes
        });
    }
    catch (error) {
        console.error('点赞视频错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.likeVideo = likeVideo;
// 获取视频的评论
const getVideoComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = parseInt(req.params.id);
        // 验证视频是否存在
        const video = yield Video_1.default.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: '视频不存在' });
        }
        // 获取所有一级评论（没有父评论的评论）
        const comments = yield Comment_1.default.findAll({
            where: {
                videoId,
                parentId: { [sequelize_1.Op.is]: null }
            },
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                },
                {
                    model: Comment_1.default,
                    as: 'replies',
                    include: [
                        {
                            model: User_1.default,
                            as: 'author',
                            attributes: ['id', 'username', 'avatar']
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC'],
                [{ model: Comment_1.default, as: 'replies' }, 'createdAt', 'ASC']
            ]
        });
        return res.status(200).json({ comments });
    }
    catch (error) {
        console.error('获取视频评论错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getVideoComments = getVideoComments;
// AI生成视频摘要
const generateVideoSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const videoId = parseInt(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const video = yield Video_1.default.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: '视频不存在' });
        }
        // 验证用户是否有权限操作
        if (video.userId !== userId) {
            return res.status(403).json({ message: '无权操作该视频' });
        }
        // 模拟AI摘要生成
        // 实际项目中，这里应该调用阿里云OCR分析视频内容，然后使用DeepSeek生成摘要
        const summary = `这是视频"${video.title}"的AI自动生成摘要。实际项目中应使用阿里云OCR和DeepSeek API生成。`;
        // 更新视频摘要
        video.summary = summary;
        yield video.save();
        return res.status(200).json({
            message: '视频摘要生成成功',
            summary
        });
    }
    catch (error) {
        console.error('生成视频摘要错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.generateVideoSummary = generateVideoSummary;
// 智能生成视频封面
const generateVideoCover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const videoId = parseInt(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const video = yield Video_1.default.findByPk(videoId);
        if (!video) {
            return res.status(404).json({ message: '视频不存在' });
        }
        // 验证用户是否有权限操作
        if (video.userId !== userId) {
            return res.status(403).json({ message: '无权操作该视频' });
        }
        // 模拟生成封面
        // 实际项目中，这里应该调用阿里云GenerateVideoCover API
        const coverFilename = `cover-${Date.now()}-${crypto_1.default.randomBytes(6).toString('hex')}.jpg`;
        const coverUrl = `/uploads/images/${coverFilename}`;
        // 更新视频封面
        video.coverUrl = coverUrl;
        yield video.save();
        return res.status(200).json({
            message: '视频封面生成成功',
            coverUrl
        });
    }
    catch (error) {
        console.error('生成视频封面错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.generateVideoCover = generateVideoCover;
