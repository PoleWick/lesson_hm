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
exports.getMessageComments = exports.likeMessage = exports.deleteMessage = exports.updateMessage = exports.getMessageById = exports.createMessage = exports.getAllMessages = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const Comment_1 = __importDefault(require("../models/Comment"));
// 获取所有留言
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;
        const { count, rows: messages } = yield Message_1.default.findAndCountAll({
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
            messages,
            totalCount: count,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum
        });
    }
    catch (error) {
        console.error('获取留言列表错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getAllMessages = getAllMessages;
// 创建新留言
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: '留言内容不能为空' });
        }
        const message = yield Message_1.default.create({
            content,
            userId
        });
        // 获取包含用户信息的完整留言
        const newMessage = yield Message_1.default.findByPk(message.id, {
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });
        return res.status(201).json({
            message: '留言发布成功',
            data: newMessage
        });
    }
    catch (error) {
        console.error('创建留言错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.createMessage = createMessage;
// 获取单个留言详情
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = parseInt(req.params.id);
        const message = yield Message_1.default.findByPk(messageId, {
            include: [
                {
                    model: User_1.default,
                    as: 'author',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });
        if (!message) {
            return res.status(404).json({ message: '留言不存在' });
        }
        return res.status(200).json({ message });
    }
    catch (error) {
        console.error('获取留言详情错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getMessageById = getMessageById;
// 更新留言
const updateMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const messageId = parseInt(req.params.id);
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: '留言内容不能为空' });
        }
        const message = yield Message_1.default.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: '留言不存在' });
        }
        // 验证用户是否有权限修改
        if (message.userId !== userId) {
            return res.status(403).json({ message: '无权修改该留言' });
        }
        // 更新留言
        message.content = content;
        yield message.save();
        return res.status(200).json({
            message: '留言更新成功',
            data: message
        });
    }
    catch (error) {
        console.error('更新留言错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.updateMessage = updateMessage;
// 删除留言
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const messageId = parseInt(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const message = yield Message_1.default.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: '留言不存在' });
        }
        // 验证用户是否有权限删除
        if (message.userId !== userId) {
            return res.status(403).json({ message: '无权删除该留言' });
        }
        // 删除留言
        yield message.destroy();
        return res.status(200).json({ message: '留言已删除' });
    }
    catch (error) {
        console.error('删除留言错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.deleteMessage = deleteMessage;
// 点赞留言
const likeMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = parseInt(req.params.id);
        const message = yield Message_1.default.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: '留言不存在' });
        }
        // 增加点赞数
        message.likes += 1;
        yield message.save();
        return res.status(200).json({
            message: '点赞成功',
            likes: message.likes
        });
    }
    catch (error) {
        console.error('点赞留言错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.likeMessage = likeMessage;
// 获取留言的评论
const getMessageComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = parseInt(req.params.id);
        // 验证留言是否存在
        const message = yield Message_1.default.findByPk(messageId);
        if (!message) {
            return res.status(404).json({ message: '留言不存在' });
        }
        // 获取所有一级评论（没有父评论的评论）
        const comments = yield Comment_1.default.findAll({
            where: {
                messageId,
                parentId: null
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
        console.error('获取留言评论错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getMessageComments = getMessageComments;
