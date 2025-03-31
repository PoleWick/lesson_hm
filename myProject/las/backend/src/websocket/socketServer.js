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
exports.broadcastToAll = exports.sendToUser = exports.getUserSocketId = exports.isUserOnline = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
let io;
let connectedUsers = [];
/**
 * 初始化WebSocket服务器
 * @param server HTTP服务器实例
 */
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: config_1.config.corsOrigin,
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('新的WebSocket连接:', socket.id);
        // 处理用户认证
        socket.on('authenticate', (token) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // 验证token
                const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
                const userId = parseInt(decoded.id);
                const username = decoded.username;
                // 将用户添加到连接列表
                connectedUsers.push({
                    userId,
                    socketId: socket.id,
                    username
                });
                console.log(`用户 ${username} (ID: ${userId}) 已连接`);
                // 通知其他用户
                socket.broadcast.emit('user:online', { userId, username });
                // 设置socket用户数据
                socket.data.userId = userId;
                socket.data.username = username;
                // 加入个人房间 (用于私聊)
                socket.join(`user:${userId}`);
                // 返回当前在线用户列表
                socket.emit('users:online', connectedUsers.map(user => ({
                    userId: user.userId,
                    username: user.username
                })));
            }
            catch (err) {
                console.error('WebSocket认证失败:', err);
                socket.emit('auth:error', { message: '认证失败' });
                socket.disconnect();
            }
        }));
        // 处理断开连接
        socket.on('disconnect', () => {
            const userIndex = connectedUsers.findIndex(u => u.socketId === socket.id);
            if (userIndex !== -1) {
                const { userId, username } = connectedUsers[userIndex];
                connectedUsers.splice(userIndex, 1);
                console.log(`用户 ${username} (ID: ${userId}) 已断开连接`);
                // 通知其他用户
                socket.broadcast.emit('user:offline', { userId, username });
            }
        });
        // 处理私聊消息
        socket.on('message:private', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { receiverId, content } = data;
            const senderId = socket.data.userId;
            const senderUsername = socket.data.username;
            if (!senderId) {
                socket.emit('error', { message: '未认证的用户' });
                return;
            }
            try {
                // 这里可以添加将消息保存到数据库的逻辑
                // 发送消息给接收者
                io.to(`user:${receiverId}`).emit('message:receive', {
                    senderId,
                    senderUsername,
                    content,
                    timestamp: new Date()
                });
                // 确认消息已发送
                socket.emit('message:sent', {
                    receiverId,
                    content,
                    timestamp: new Date()
                });
            }
            catch (err) {
                console.error('发送私聊消息失败:', err);
                socket.emit('error', { message: '发送消息失败' });
            }
        }));
        // 其他事件处理...
    });
    console.log('WebSocket服务器初始化完成');
};
exports.initializeSocket = initializeSocket;
/**
 * 检查用户是否在线
 * @param userId 用户ID
 * @returns 用户是否在线
 */
const isUserOnline = (userId) => {
    return connectedUsers.some(user => user.userId === userId);
};
exports.isUserOnline = isUserOnline;
/**
 * 获取用户的socket ID
 * @param userId 用户ID
 * @returns socket ID或null
 */
const getUserSocketId = (userId) => {
    const user = connectedUsers.find(u => u.userId === userId);
    return user ? user.socketId : null;
};
exports.getUserSocketId = getUserSocketId;
/**
 * 向特定用户发送事件
 * @param userId 目标用户ID
 * @param event 事件名称
 * @param data 事件数据
 */
const sendToUser = (userId, event, data) => {
    if (!io) {
        console.error('WebSocket服务器未初始化');
        return;
    }
    const socketId = (0, exports.getUserSocketId)(userId);
    if (socketId) {
        io.to(socketId).emit(event, data);
    }
};
exports.sendToUser = sendToUser;
/**
 * 广播事件给所有已认证用户
 * @param event 事件名称
 * @param data 事件数据
 */
const broadcastToAll = (event, data) => {
    if (!io) {
        console.error('WebSocket服务器未初始化');
        return;
    }
    io.emit(event, data);
};
exports.broadcastToAll = broadcastToAll;
exports.default = { initializeSocket: exports.initializeSocket, isUserOnline: exports.isUserOnline, sendToUser: exports.sendToUser, broadcastToAll: exports.broadcastToAll };
