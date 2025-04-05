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
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // 检查必填字段
    if (!username || !email || !password) {
      error(res, '用户名、邮箱和密码为必填项', 400);
      return;
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
      error(res, '用户名或邮箱已存在', 409);
      return;
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

    success(res, {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      ...tokens
    }, '注册成功', 201);
    return;
  } catch (err) {
    console.error('注册失败:', err);
    error(res, '注册失败，请稍后再试', 500);
    return;
  }
};

/**
 * 用户登录
 * @param req 请求对象
 * @param res 响应对象
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    // 检查必填字段
    if ((!username && !email) || !password) {
      error(res, '用户名/邮箱和密码为必填项', 400);
      return;
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
      error(res, '用户名/邮箱或密码错误', 401);
      return;
    }

    console.log('找到用户:', user.username, user.email);

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);
    console.log('密码验证结果:', isPasswordValid);
    
    if (!isPasswordValid) {
      error(res, '用户名/邮箱或密码错误', 401);
      return;
    }

    // 生成令牌
    const tokens = generateTokens({
      id: user.id.toString(),
      username: user.username,
      role: user.role
    });

    success(res, {
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
    return;
  } catch (err) {
    console.error('登录失败:', err);
    error(res, '登录失败，请稍后再试', 500);
    return;
  }
};

/**
 * 刷新访问令牌
 * @param req 请求对象
 * @param res 响应对象
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      error(res, '刷新令牌为必填项', 400);
      return;
    }

    // 导入刷新令牌验证函数
    const { verifyRefreshToken } = require('../utils/jwt.utils');
    
    // 验证刷新令牌
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      error(res, '刷新令牌无效或已过期', 401);
      return;
    }

    // 生成新的令牌对
    const tokens = generateTokens({
      id: payload.id,
      username: payload.username,
      role: payload.role
    });

    success(res, tokens, '令牌刷新成功');
    return;
  } catch (err) {
    console.error('令牌刷新失败:', err);
    error(res, '令牌刷新失败，请稍后再试', 500);
    return;
  }
};

/**
 * 获取当前用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
export const getUserInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      error(res, '未授权', 401);
      return;
    }
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'avatar', 'bio', 'role']
    });
    
    if (!user) {
      error(res, '用户不存在', 404);
      return;
    }
    
    success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      isOnline: isUserOnline(user.id)
    }, '用户信息获取成功');
    return;
  } catch (err) {
    console.error('获取用户信息失败:', err);
    error(res, '获取用户信息失败，请稍后再试', 500);
    return;
  }
};

/**
 * 更新当前用户信息
 * @param req 请求对象
 * @param res 响应对象
 */
export const updateUserInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      error(res, '未授权', 401);
      return;
    }
    
    const { username, email, bio } = req.body;
    
    // 查找用户
    const user = await User.findByPk(userId);
    
    if (!user) {
      error(res, '用户不存在', 404);
      return;
    }
    
    // 如果修改用户名，检查是否已存在
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        where: { username }
      });
      
      if (existingUser) {
        error(res, '用户名已存在', 409);
        return;
      }
      
      user.username = username;
    }
    
    // 如果修改邮箱，检查是否已存在
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email }
      });
      
      if (existingEmail) {
        error(res, '邮箱已存在', 409);
        return;
      }
      
      user.email = email;
    }
    
    // 更新个人简介
    if (bio !== undefined) {
      user.bio = bio;
    }
    
    // 保存更改
    await user.save();
    
    success(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role
    }, '用户信息更新成功');
    return;
  } catch (err) {
    console.error('更新用户信息失败:', err);
    error(res, '更新用户信息失败，请稍后再试', 500);
    return;
  }
};

/**
 * 获取所有用户列表（管理员）
 * @param req 请求对象
 * @param res 响应对象
 */
export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 分页参数
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    // 查询用户列表
    const { count, rows: users } = await User.findAndCountAll({
      attributes: ['id', 'username', 'email', 'avatar', 'bio', 'role', 'createdAt'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // 构建用户列表，添加在线状态
    const userList = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
      isOnline: isUserOnline(user.id)
    }));
    
    success(res, {
      users: userList,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, '用户列表获取成功');
    return;
  } catch (err) {
    console.error('获取用户列表失败:', err);
    error(res, '获取用户列表失败，请稍后再试', 500);
    return;
  }
};

/**
 * 更改用户角色（管理员）
 * @param req 请求对象
 * @param res 响应对象
 */
export const changeUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // 检查角色是否有效
    if (role !== 'user' && role !== 'admin') {
      error(res, '无效的角色', 400);
      return;
    }
    
    // 查找用户
    const user = await User.findByPk(userId);
    
    if (!user) {
      error(res, '用户不存在', 404);
      return;
    }
    
    // 不允许修改系统用户的角色
    if (user.role === 'system') {
      error(res, '不允许修改系统用户的角色', 403);
      return;
    }
    
    // 更新角色
    user.role = role;
    await user.save();
    
    success(res, {
      id: user.id,
      username: user.username,
      role: user.role
    }, '用户角色更改成功');
    return;
  } catch (err) {
    console.error('更改用户角色失败:', err);
    error(res, '更改用户角色失败，请稍后再试', 500);
    return;
  }
};

// 获取用户个人资料
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    // 将字符串ID转换为数字
    const userIdNum = parseInt(userId, 10);

    // 查找用户
    const user = await User.findByPk(userIdNum, {
      attributes: ['id', 'username', 'email', 'avatar', 'bio', 'role', 'createdAt']
    });

    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    res.status(200).json({ user });
    return;
  } catch (err) {
    console.error('获取用户资料错误:', err);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 更新用户个人资料
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { username, bio } = req.body;

    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    // 将字符串ID转换为数字
    const userIdNum = parseInt(userId, 10);

    // 查找用户
    const user = await User.findByPk(userIdNum);
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    // 检查用户名是否已被其他用户使用
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        where: {
          username,
          id: { [Op.ne]: userIdNum }
        }
      });

      if (existingUsername) {
        res.status(400).json({ message: '用户名已被使用' });
        return;
      }
    }

    // 更新用户信息
    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
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
    return;
  } catch (err) {
    console.error('更新用户资料错误:', err);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 更新用户头像
export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: '请上传头像文件' });
      return;
    }

    // 将字符串ID转换为数字
    const userIdNum = parseInt(userId, 10);

    // 查找用户
    const user = await User.findByPk(userIdNum);
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    // 更新头像
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      message: '头像更新成功',
      avatar: avatarUrl
    });
    return;
  } catch (err) {
    console.error('更新头像错误:', err);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 获取用户聊天列表
export const getUserChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    // 将字符串ID转换为数字
    const userIdNum = parseInt(userId, 10);

    // 查找与该用户相关的所有聊天消息
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: userIdNum },
          { receiverId: userIdNum }
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
      const otherUserId = message.senderId === userIdNum ? message.receiverId : message.senderId;
      const otherUser = message.senderId === userIdNum ? message.receiver : message.sender;

      if (!chatMap.has(otherUserId) && otherUser) {
        chatMap.set(otherUserId, {
          id: otherUserId,
          username: otherUser.username,
          avatar: otherUser.avatar,
          lastMessage: message.content,
          unread: message.receiverId === userIdNum && !message.isRead ? 1 : 0,
          timestamp: message.createdAt
        });
      }
    });

    // 转换为数组并按最后消息时间排序
    const chats = Array.from(chatMap.values()).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.status(200).json({ chats });
    return;
  } catch (err) {
    console.error('获取用户聊天列表错误:', err);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
};

// 获取与特定用户的聊天历史
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const otherUserId = parseInt(req.params.userId);

    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    // 将字符串ID转换为数字
    const userIdNum = parseInt(userId, 10);

    // 验证其他用户是否存在
    const otherUser = await User.findByPk(otherUserId, {
      attributes: ['id', 'username', 'avatar']
    });

    if (!otherUser) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    // 获取聊天历史
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { senderId: userIdNum, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userIdNum }
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
      message => message.receiverId === userIdNum && !message.isRead
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

    res.status(200).json({
      otherUser,
      messages
    });
    return;
  } catch (err) {
    console.error('获取聊天历史错误:', err);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
    return;
  }
}; 