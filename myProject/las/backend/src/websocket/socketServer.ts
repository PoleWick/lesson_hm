import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

// 存储连接的用户
interface ConnectedUser {
  userId: number;
  socketId: string;
  username: string;
}

let io: Server;
let connectedUsers: ConnectedUser[] = [];

/**
 * 初始化WebSocket服务器
 * @param server HTTP服务器实例
 */
export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: config.corsOrigin,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('新的WebSocket连接:', socket.id);

    // 处理用户认证
    socket.on('authenticate', async (token: string) => {
      try {
        // 验证token
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string, username: string };
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
      } catch (err) {
        console.error('WebSocket认证失败:', err);
        socket.emit('auth:error', { message: '认证失败' });
        socket.disconnect();
      }
    });

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
    socket.on('message:private', async (data: { receiverId: number, content: string }) => {
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
      } catch (err) {
        console.error('发送私聊消息失败:', err);
        socket.emit('error', { message: '发送消息失败' });
      }
    });

    // 其他事件处理...
  });

  console.log('WebSocket服务器初始化完成');
};

/**
 * 检查用户是否在线
 * @param userId 用户ID
 * @returns 用户是否在线
 */
export const isUserOnline = (userId: number): boolean => {
  return connectedUsers.some(user => user.userId === userId);
};

/**
 * 获取用户的socket ID
 * @param userId 用户ID
 * @returns socket ID或null
 */
export const getUserSocketId = (userId: number): string | null => {
  const user = connectedUsers.find(u => u.userId === userId);
  return user ? user.socketId : null;
};

/**
 * 向特定用户发送事件
 * @param userId 目标用户ID
 * @param event 事件名称
 * @param data 事件数据
 */
export const sendToUser = (userId: number, event: string, data: any): void => {
  if (!io) {
    console.error('WebSocket服务器未初始化');
    return;
  }
  
  const socketId = getUserSocketId(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

/**
 * 广播事件给所有已认证用户
 * @param event 事件名称
 * @param data 事件数据
 */
export const broadcastToAll = (event: string, data: any): void => {
  if (!io) {
    console.error('WebSocket服务器未初始化');
    return;
  }
  
  io.emit(event, data);
};

export default { initializeSocket, isUserOnline, sendToUser, broadcastToAll }; 