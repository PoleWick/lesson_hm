import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Op } from 'sequelize';

// 令牌配置
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15分钟
const REFRESH_TOKEN_EXPIRY = '7d'; // 7天

/**
 * 生成访问令牌和刷新令牌
 */
const generateTokens = (payload: any) => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  
  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY
  };
};

/**
 * 验证刷新令牌
 */
const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.error('刷新令牌验证失败:', error);
    return null;
  }
};

/**
 * 用户注册
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码为必填项'
      });
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
      res.status(409).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
      return;
    }

    // 创建新用户
    const newUser = await User.create({
      username,
      email,
      password, // 密码会在User模型的beforeCreate钩子中自动加密
      role: 'user'
    });

    // 生成JWT令牌
    const tokens = generateTokens({
      id: newUser.id.toString(),
      username: newUser.username,
      role: newUser.role
    });

    // 返回用户信息和令牌
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        ...tokens
      }
    });
    return;
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，注册失败'
    });
    return;
  }
};

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if ((!username && !email) || !password) {
      res.status(400).json({
        success: false,
        message: '用户名/邮箱和密码为必填项'
      });
      return;
    }

    // 查找用户
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username || '' },
          { email: email || username || '' } // 支持使用邮箱作为用户名登录
        ]
      }
    });

    // 用户不存在
    if (!user) {
      res.status(401).json({
        success: false,
        message: '用户名/邮箱或密码错误'
      });
      return;
    }

    // 验证密码
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: '用户名/邮箱或密码错误'
      });
      return;
    }

    // 生成JWT令牌
    const tokens = generateTokens({
      id: user.id.toString(),
      username: user.username,
      role: user.role
    });

    // 返回用户信息和令牌
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        },
        ...tokens
      }
    });
    return;
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，登录失败'
    });
    return;
  }
};

/**
 * 刷新访问令牌
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    // 验证刷新令牌
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: '刷新令牌不能为空'
      });
      return;
    }

    // 验证刷新令牌
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      res.status(401).json({
        success: false,
        message: '无效或已过期的刷新令牌'
      });
      return;
    }

    // 检查用户是否存在
    const user = await User.findByPk(parseInt(payload.id, 10));
    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    // 生成新的令牌
    const tokens = generateTokens({
      id: user.id.toString(),
      username: user.username,
      role: user.role
    });

    // 返回新令牌
    res.status(200).json({
      success: true,
      message: '令牌刷新成功',
      data: tokens
    });
    return;
  } catch (error) {
    console.error('刷新令牌失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，刷新令牌失败'
    });
    return;
  }
};

/**
 * 修改密码
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    // 检查用户是否已登录
    if (!userId) {
      res.status(401).json({
        success: false,
        message: '请先登录'
      });
      return;
    }

    // 验证必填字段
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: '当前密码和新密码为必填项'
      });
      return;
    }

    // 如果新密码太短
    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: '新密码长度不能少于6个字符'
      });
      return;
    }

    // 查找用户
    const user = await User.findByPk(parseInt(userId, 10));
    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    // 验证当前密码
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: '当前密码错误'
      });
      return;
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    // 返回成功消息
    res.status(200).json({
      success: true,
      message: '密码修改成功'
    });
    return;
  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，修改密码失败'
    });
    return;
  }
};

/**
 * 重置密码
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, newPassword } = req.body;
    
    // 验证必填字段
    if (!userId || !newPassword) {
      res.status(400).json({
        success: false,
        message: '用户ID和新密码为必填项'
      });
      return;
    }
    
    // 验证调用者是否为管理员
    const callerRole = req.user?.role;
    if (callerRole !== 'admin' && callerRole !== 'system') {
      res.status(403).json({
        success: false,
        message: '权限不足，需要管理员权限'
      });
      return;
    }
    
    // 查找用户
    const user = await User.findByPk(parseInt(userId, 10));
    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    // 返回成功消息
    res.status(200).json({
      success: true,
      message: '密码重置成功'
    });
    return;
  } catch (error) {
    console.error('重置密码失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，重置密码失败'
    });
    return;
  }
}; 