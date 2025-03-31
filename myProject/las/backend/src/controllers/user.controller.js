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
exports.getChatHistory = exports.getUserChats = exports.updateAvatar = exports.updateUserProfile = exports.getUserProfile = exports.changeUserRole = exports.getAllUsers = exports.updateUserInfo = exports.getUserInfo = exports.refreshToken = exports.login = exports.register = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const apiResponse_1 = require("../utils/apiResponse");
const User_1 = __importDefault(require("../models/User"));
const ChatMessage_1 = __importDefault(require("../models/ChatMessage"));
const socketServer_1 = require("../websocket/socketServer");
const sequelize_1 = require("sequelize");
/**
 * 用户注册
 * @param req 请求对象
 * @param res 响应对象
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        // 检查必填字段
        if (!username || !email || !password) {
            return (0, apiResponse_1.error)(res, '用户名、邮箱和密码为必填项', 400);
        }
        // 检查用户名或邮箱是否已存在
        const existingUser = yield User_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { username },
                    { email }
                ]
            }
        });
        if (existingUser) {
            return (0, apiResponse_1.error)(res, '用户名或邮箱已存在', 409);
        }
        // 创建新用户（密码加密在User模型的beforeCreate钩子中自动完成）
        const newUser = yield User_1.default.create({
            username,
            email,
            password,
            role: 'user'
        });
        // 生成令牌
        const tokens = (0, jwt_utils_1.generateTokens)({
            id: newUser.id.toString(),
            username: newUser.username,
            role: newUser.role
        });
        return (0, apiResponse_1.success)(res, Object.assign({ user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            } }, tokens), '注册成功', 201);
    }
    catch (err) {
        console.error('注册失败:', err);
        return (0, apiResponse_1.error)(res, '注册失败，请稍后再试', 500);
    }
});
exports.register = register;
/**
 * 用户登录
 * @param req 请求对象
 * @param res 响应对象
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // 检查必填字段
        if (!username || !password) {
            return (0, apiResponse_1.error)(res, '用户名和密码为必填项', 400);
        }
        // 查找用户
        const user = yield User_1.default.findOne({
            where: {
                username
            }
        });
        // 检查用户是否存在
        if (!user) {
            return (0, apiResponse_1.error)(res, '用户名或密码错误', 401);
        }
        // 验证密码
        const isPasswordValid = yield user.validatePassword(password);
        if (!isPasswordValid) {
            return (0, apiResponse_1.error)(res, '用户名或密码错误', 401);
        }
        // 生成令牌
        const tokens = (0, jwt_utils_1.generateTokens)({
            id: user.id.toString(),
            username: user.username,
            role: user.role
        });
        return (0, apiResponse_1.success)(res, Object.assign({ user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                role: user.role
            } }, tokens), '登录成功');
    }
    catch (err) {
        console.error('登录失败:', err);
        return (0, apiResponse_1.error)(res, '登录失败，请稍后再试', 500);
    }
});
exports.login = login;
/**
 * 刷新访问令牌
 * @param req 请求对象
 * @param res 响应对象
 */
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return (0, apiResponse_1.error)(res, '刷新令牌为必填项', 400);
        }
        // 导入刷新令牌验证函数
        const { verifyRefreshToken } = require('../utils/jwt.utils');
        // 验证刷新令牌
        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return (0, apiResponse_1.error)(res, '刷新令牌无效或已过期', 401);
        }
        // 生成新的令牌对
        const tokens = (0, jwt_utils_1.generateTokens)({
            id: payload.id,
            username: payload.username,
            role: payload.role
        });
        return (0, apiResponse_1.success)(res, tokens, '令牌刷新成功');
    }
    catch (err) {
        console.error('令牌刷新失败:', err);
        return (0, apiResponse_1.error)(res, '令牌刷新失败，请稍后再试', 500);
    }
});
exports.refreshToken = refreshToken;
/**
 * 获取当前用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return (0, apiResponse_1.error)(res, '未授权', 401);
        }
        const user = yield User_1.default.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'avatar', 'bio', 'role']
        });
        if (!user) {
            return (0, apiResponse_1.error)(res, '用户不存在', 404);
        }
        return (0, apiResponse_1.success)(res, {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            role: user.role,
            isOnline: (0, socketServer_1.isUserOnline)(user.id)
        });
    }
    catch (err) {
        console.error('获取用户信息失败:', err);
        return (0, apiResponse_1.error)(res, '获取用户信息失败，请稍后再试', 500);
    }
});
exports.getUserInfo = getUserInfo;
/**
 * 更新用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { username, bio } = req.body;
        // 查找用户
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return (0, apiResponse_1.error)(res, '用户不存在', 404);
        }
        // 检查用户名是否已被占用
        if (username && username !== user.username) {
            const existingUsername = yield User_1.default.findOne({
                where: {
                    username,
                    id: { [sequelize_1.Op.ne]: userId }
                }
            });
            if (existingUsername) {
                return (0, apiResponse_1.error)(res, '用户名已被使用', 400);
            }
        }
        // 更新用户信息
        if (username)
            user.username = username;
        if (bio !== undefined)
            user.bio = bio;
        yield user.save();
        return (0, apiResponse_1.success)(res, {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            role: user.role
        }, '个人资料更新成功');
    }
    catch (err) {
        console.error('更新用户资料错误:', err);
        return (0, apiResponse_1.error)(res, '服务器错误，请稍后再试', 500);
    }
});
exports.updateUserInfo = updateUserInfo;
/**
 * 获取所有用户(管理员)
 * @param req 请求对象
 * @param res 响应对象
 */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { count, rows } = yield User_1.default.findAndCountAll({
            attributes: ['id', 'username', 'email', 'avatar', 'role', 'createdAt'],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        // 添加在线状态
        const users = rows.map(user => (Object.assign(Object.assign({}, user.toJSON()), { isOnline: (0, socketServer_1.isUserOnline)(user.id) })));
        return (0, apiResponse_1.success)(res, {
            users,
            total: count,
            page,
            limit
        });
    }
    catch (err) {
        console.error('获取用户列表失败:', err);
        return (0, apiResponse_1.error)(res, '获取用户列表失败，请稍后再试', 500);
    }
});
exports.getAllUsers = getAllUsers;
/**
 * 更改用户角色(管理员)
 * @param req 请求对象
 * @param res 响应对象
 */
const changeUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return (0, apiResponse_1.error)(res, '无效的角色类型', 400);
        }
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return (0, apiResponse_1.error)(res, '用户不存在', 404);
        }
        // 不允许修改系统管理员
        if (user.role === 'system') {
            return (0, apiResponse_1.error)(res, '不能修改系统管理员的角色', 403);
        }
        user.role = role;
        yield user.save();
        return (0, apiResponse_1.success)(res, {
            id: user.id,
            username: user.username,
            role: user.role
        }, '用户角色更新成功');
    }
    catch (err) {
        console.error('更改用户角色失败:', err);
        return (0, apiResponse_1.error)(res, '更改用户角色失败，请稍后再试', 500);
    }
});
exports.changeUserRole = changeUserRole;
// 获取用户个人资料
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // 查找用户
        const user = yield User_1.default.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'avatar', 'bio', 'role', 'createdAt']
        });
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('获取用户资料错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getUserProfile = getUserProfile;
// 更新用户个人资料
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { username, bio } = req.body;
        // 查找用户
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        // 检查用户名是否已被其他用户使用
        if (username && username !== user.username) {
            const existingUsername = yield User_1.default.findOne({
                where: {
                    username,
                    id: { [sequelize_1.Op.ne]: userId }
                }
            });
            if (existingUsername) {
                return res.status(400).json({ message: '用户名已被使用' });
            }
        }
        // 更新用户信息
        if (username)
            user.username = username;
        if (bio !== undefined)
            user.bio = bio;
        yield user.save();
        return res.status(200).json({
            message: '个人资料更新成功',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('更新用户资料错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.updateUserProfile = updateUserProfile;
// 更新用户头像
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!req.file) {
            return res.status(400).json({ message: '请上传头像文件' });
        }
        // 查找用户
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        // 更新头像
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        user.avatar = avatarUrl;
        yield user.save();
        return res.status(200).json({
            message: '头像更新成功',
            avatar: avatarUrl
        });
    }
    catch (error) {
        console.error('更新头像错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.updateAvatar = updateAvatar;
// 获取用户聊天列表
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: '未授权' });
        }
        // 查找与该用户相关的所有聊天消息
        const messages = yield ChatMessage_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: [
                {
                    model: User_1.default,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar']
                },
                {
                    model: User_1.default,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        // 处理消息，按对话分组
        const chatMap = new Map();
        messages.forEach(message => {
            const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
            const otherUser = message.senderId === userId ? message.receiver : message.sender;
            if (!chatMap.has(otherUserId) && otherUser) {
                chatMap.set(otherUserId, {
                    id: otherUserId,
                    username: otherUser.username,
                    avatar: otherUser.avatar,
                    lastMessage: message.content,
                    unread: message.receiverId === userId && !message.isRead ? 1 : 0,
                    timestamp: message.createdAt
                });
            }
        });
        // 转换为数组并按最后消息时间排序
        const chats = Array.from(chatMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return res.status(200).json({ chats });
    }
    catch (error) {
        console.error('获取用户聊天列表错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getUserChats = getUserChats;
// 获取与特定用户的聊天历史
const getChatHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const otherUserId = parseInt(req.params.userId);
        // 验证其他用户是否存在
        const otherUser = yield User_1.default.findByPk(otherUserId, {
            attributes: ['id', 'username', 'avatar']
        });
        if (!otherUser) {
            return res.status(404).json({ message: '用户不存在' });
        }
        // 获取聊天历史
        const messages = yield ChatMessage_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            include: [
                {
                    model: User_1.default,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar']
                }
            ],
            order: [['createdAt', 'ASC']]
        });
        // 将未读消息标记为已读
        const unreadMessages = messages.filter(message => message.receiverId === userId && !message.isRead);
        if (unreadMessages.length > 0) {
            yield ChatMessage_1.default.update({ isRead: true }, {
                where: {
                    id: unreadMessages.map(message => message.id)
                }
            });
        }
        return res.status(200).json({
            otherUser,
            messages
        });
    }
    catch (error) {
        console.error('获取聊天历史错误:', error);
        return res.status(500).json({ message: '服务器错误，请稍后再试' });
    }
});
exports.getChatHistory = getChatHistory;
