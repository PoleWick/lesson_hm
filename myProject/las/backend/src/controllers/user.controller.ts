import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/jwt.utils';
import { success, error } from '../utils/apiResponse';
import User from '../models/User';
import ChatMessage from '../models/ChatMessage';
import { isUserOnline } from '../websocket/socketServer';
import { Op, Sequelize } from 'sequelize';
import path from 'path';
import fs from 'fs';

/**
 * 用户注册
 * @param req 请求对象
 * @param res 响应对象
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 检查必填字段
    if (!username || !email || !password) {
      return error(res, '用户名、邮箱和密码为必填项', 400);
    }

    // 检查用户名或邮箱是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return error(res, '用户名或邮箱已存在', 409);
    }

    // 创建新用户（密码加密在User模型的beforeCreate钩子中自动完成）
    const newUser = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    // 生成令牌
    const tokens = generateTokens({
      id: newUser.id.toString(),
      username: newUser.username,
      role: newUser.role
    });

    return success(res, {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      ...tokens
    }, '注册成功', 201);
  } catch (err) {
    console.error('注册失败:', err);
    return error(res, '注册失败，请稍后再试', 500);
  }
};

/**
 * 用户登录
 * @param req 请求对象
 * @param res 响应对象
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // 检查必填字段
    if ((!username && !email) || !password) {
      return error(res, '用户名/邮箱和密码为必填项', 400);
    }

    console.log('登录尝试:', { username, email, password });

    // 查找用户（允许使用用户名或邮箱登录）
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: email || username } // 支持使用邮箱作为登录名
        ]
      }
    });

    // 检查用户是否存在
    if (!user) {
      console.log('用户不存在');
      return error(res, '用户名/邮箱或密码错误', 401);
    }

    console.log('找到用户:', user.username, user.email);

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);
    console.log('密码验证结果:', isPasswordValid);
    
    if (!isPasswordValid) {
      return error(res, '用户名/邮箱或密码错误', 401);
    }

    // 生成令牌
    const tokens = generateTokens({
      id: user.id.toString(),
      username: user.username,
      role: user.role
    });

    return success(res, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role
      },
      ...tokens
    }, '登录成功');
  } catch (err) {
    console.error('登录失败:', err);
    return error(res, '登录失败，请稍后再试', 500);
  }
};

/**
 * 刷新访问令牌
 * @param req 请求对象
 * @param res 响应对象
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return error(res, '刷新令牌为必填项', 400);
    }

    // 导入刷新令牌验证函数
    const { verifyRefreshToken } = require('../utils/jwt.utils');
    
    // 验证刷新令牌
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return error(res, '刷新令牌无效或已过期', 401);
    }

    // 生成新的令牌对
    const tokens = generateTokens({
      id: payload.id,
      username: payload.username,
      role: payload.role
    });

    return success(res, tokens, '令牌刷新成功');
  } catch (err) {
    console.error('令牌刷新失败:', err);
    return error(res, '令牌刷新失败，请稍后再试', 500);
  }
};

/**
 * 获取当前用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return error(res, '未授权', 401);
    }
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'avatar', 'bio', 'role']
    });
    
    if (!user) {
      return error(res, '用户不存在', 404);
    }
    
    return success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      isOnline: isUserOnline(user.id)
    });
  } catch (err) {
    console.error('获取用户信息失败:', err);
    return error(res, '获取用户信息失败，请稍后再试', 500);
  }
};

/**
 * 更新用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { username, bio } = req.body;

    // 查找用户
    const user = await User.findByPk(userId);
    if (!user) {
      return error(res, '用户不存在', 404);
    }

    // 检查用户名是否已被占用
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: userId }
        }
      });

      if (existingUsername) {
        return error(res, '用户名已被使用', 400);
      }
    }

    // 更新用户信息
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    return success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role
    }, '个人资料更新成功');

  } catch (err) {
    console.error('更新用户资料错误:', err);
    return error(res, '服务器错误，请稍后再试', 500);
  }
};

/**
 * 获取所有用户(管理员)
 * @param req 请求对象
 * @param res 响应对象
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'username', 'email', 'avatar', 'role', 'createdAt'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    // 添加在线状态
    const users = rows.map(user => ({
      ...user.toJSON(),
      isOnline: isUserOnline(user.id)
    }));

    return success(res, {
      users,
      total: count,
      page,
      limit
    });
  } catch (err) {
    console.error('获取用户列表失败:', err);
    return error(res, '获取用户列表失败，请稍后再试', 500);
  }
};

/**
 * 更改用户角色(管理员)
 * @param req 请求对象
 * @param res 响应对象
 */
export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return error(res, '无效的角色类型', 400);
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return error(res, '用户不存在', 404);
    }

    // 不允许修改系统管理员
    if (user.role === 'system') {
      return error(res, '不能修改系统管理员的角色', 403);
    }

    user.role = role;
    await user.save();

    return success(res, {
      id: user.id,
      username: user.username,
      role: user.role
    }, '用户角色更新成功');
  } catch (err) {
    console.error('更改用户角色失败:', err);
    return error(res, '更改用户角色失败，请稍后再试', 500);
  }
};

// 获取用户个人资料
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // 查找用户
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'avatar', 'bio', 'role', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error('获取用户资料错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新用户个人资料
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { username, bio } = req.body;

    // 查找用户
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 检查用户名是否已被其他用户使用
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: userId }
        }
      });

      if (existingUsername) {
        return res.status(400).json({ message: '用户名已被使用' });
      }
    }

    // 更新用户信息
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;

    await user.save();

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

  } catch (error) {
    console.error('更新用户资料错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 更新用户头像
export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!req.file) {
      return res.status(400).json({ message: '请上传头像文件' });
    }

    // 查找用户
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新头像
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    return res.status(200).json({
      message: '头像更新成功',
      avatar: avatarUrl
    });

  } catch (error) {
    console.error('更新头像错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取用户聊天列表
export const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    // 查找与该用户相关的所有聊天消息
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        },
        {
          model: User,
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
    const chats = Array.from(chatMap.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return res.status(200).json({ chats });

  } catch (error) {
    console.error('获取用户聊天列表错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 获取与特定用户的聊天历史
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const otherUserId = parseInt(req.params.userId);

    // 验证其他用户是否存在
    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['id', 'username', 'avatar']
    });

    if (!otherUser) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 获取聊天历史
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'avatar']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    // 将未读消息标记为已读
    const unreadMessages = messages.filter(
      message => message.receiverId === userId && !message.isRead
    );

    if (unreadMessages.length > 0) {
      await ChatMessage.update(
        { isRead: true },
        {
          where: {
            id: unreadMessages.map(message => message.id)
          }
        }
      );
    }

    return res.status(200).json({
      otherUser,
      messages
    });

  } catch (error) {
    console.error('获取聊天历史错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 