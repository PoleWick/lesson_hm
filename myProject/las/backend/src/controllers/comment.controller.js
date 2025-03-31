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
exports.generateAIReply = exports.replyToComment = exports.likeComment = exports.deleteComment = exports.updateComment = exports.getCommentById = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
const Video_1 = __importDefault(require("../models/Video"));
// 创建新评论
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content, messageId, videoId, parentId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: '评论内容不能为空' });
        }
        // 验证必须指定留言ID或视频ID
        if (!messageId && !videoId) {
            return res.status(400).json({ message: '必须指定留言ID或视频ID' });
        }
        // 如果有父评论ID，验证父评论是否存在
        if (parentId) {
            const parentComment = yield Comment_1.default.findByPk(parentId);
            if (!parentComment) {
                return res.status(404).json({ message: '父评论不存在' });
            }
        }
        // 验证留言或视频是否存在
        if (messageId) {
            const message = yield Message_1.default.findByPk(messageId);
            if (!message) {
                return res.status(404).json({ message: '留言不存在' });
            }
        }
        else if (videoId) {
            const video = yield Video_1.default.findByPk(videoId);
            if (!video) {
                return res.status(404).json({ message: '视频不存在' });
            }
        }
        // 创建评论
        const comment = yield Comment_1.default.create({
            content,
            userId,
            messageId: messageId || undefined,
            videoId: videoId || undefined,
            parentId: parentId || undefined
        });
        // 获取包含用户信息的评论
        const newComment = yield Comment_1.default.findByPk(comment.id, {
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });
        return res.status(201).json({
            message: '评论发布成功',
            comment: newComment
        });
    }
    catch (error) {
        console.error('创建评论错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.createComment = createComment;
// 获取评论详情（包括回复）
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = parseInt(req.params.id);
        const comment = yield Comment_1.default.findByPk(commentId, {
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
            ]
        });
        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }
        return res.status(200).json({ comment });
    }
    catch (error) {
        console.error('获取评论详情错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getCommentById = getCommentById;
// 更新评论
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const commentId = parseInt(req.params.id);
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: '评论内容不能为空' });
        }
        const comment = yield Comment_1.default.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }
        // 验证用户是否有权限修改
        if (comment.userId !== userId) {
            return res.status(403).json({ message: '无权修改该评论' });
        }
        // 更新评论
        comment.content = content;
        yield comment.save();
        return res.status(200).json({
            message: '评论更新成功',
            comment
        });
    }
    catch (error) {
        console.error('更新评论错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.updateComment = updateComment;
// 删除评论
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const commentId = parseInt(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const comment = yield Comment_1.default.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }
        // 验证用户是否有权限删除
        if (comment.userId !== userId) {
            return res.status(403).json({ message: '无权删除该评论' });
        }
        // 删除评论
        yield comment.destroy();
        return res.status(200).json({ message: '评论已删除' });
    }
    catch (error) {
        console.error('删除评论错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.deleteComment = deleteComment;
// 点赞评论
const likeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = parseInt(req.params.id);
        const comment = yield Comment_1.default.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }
        // 增加点赞数
        comment.likes += 1;
        yield comment.save();
        return res.status(200).json({
            message: '点赞成功',
            likes: comment.likes
        });
    }
    catch (error) {
        console.error('点赞评论错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.likeComment = likeComment;
// 回复评论
const replyToComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parentId = parseInt(req.params.id);
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: '回复内容不能为空' });
        }
        // 验证父评论是否存在
        const parentComment = yield Comment_1.default.findByPk(parentId);
        if (!parentComment) {
            return res.status(404).json({ message: '评论不存在' });
        }
        // 创建回复
        const reply = yield Comment_1.default.create({
            content,
            userId,
            messageId: parentComment.messageId,
            videoId: parentComment.videoId,
            parentId
        });
        // 获取包含用户信息的回复
        const newReply = yield Comment_1.default.findByPk(reply.id, {
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });
        return res.status(201).json({
            message: '回复发布成功',
            reply: newReply
        });
    }
    catch (error) {
        console.error('回复评论错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.replyToComment = replyToComment;
// AI生成评论回复
const generateAIReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const commentId = parseInt(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // 验证评论是否存在
        const comment = yield Comment_1.default.findByPk(commentId, {
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });
        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }
        // 模拟AI生成的回复内容
        // 实际项目中，这里应该调用DeepSeek API生成回复
        const aiResponse = `这是对"${comment.content}"的AI自动回复。实际项目中应使用DeepSeek API生成。`;
        // 创建AI回复
        const reply = yield Comment_1.default.create({
            content: aiResponse,
            userId, // 使用当前用户ID作为AI回复的发布者
            messageId: comment.messageId,
            videoId: comment.videoId,
            parentId: commentId
        });
        // 获取包含用户信息的AI回复
        const aiReply = yield Comment_1.default.findByPk(reply.id, {
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });
        return res.status(201).json({
            message: 'AI回复生成成功',
            reply: aiReply
        });
    }
    catch (error) {
        console.error('生成AI回复错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.generateAIReply = generateAIReply;
