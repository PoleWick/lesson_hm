import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// 令牌配置
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key';

// 扩展Request接口，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
        tokenNearExpiry?: boolean;
      };
    }
  }
}

/**
 * 验证JWT令牌并将用户信息附加到请求对象
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: '未提供授权令牌'
      });
      return;
    }

    // 检查令牌格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        success: false,
        message: '授权令牌格式无效'
      });
      return;
    }

    const token = parts[1];

    // 验证令牌
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
    if (!payload) {
      res.status(401).json({
        success: false,
        message: '无效或过期的令牌'
      });
      return;
    }

    // 验证用户是否存在
    const user = await User.findByPk(parseInt(payload.id, 10));
    if (!user) {
      res.status(401).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    // 将用户信息附加到请求对象
    req.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role || 'user',
      tokenNearExpiry: false
    };

    // 继续下一个中间件
    next();
  } catch (error) {
    console.error('令牌验证失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，令牌验证失败'
    });
    return;
  }
};

/**
 * 可选令牌验证 - 如果令牌存在则验证，不存在则继续
 */
export const optionalToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 从请求头获取令牌
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }

    // 检查令牌格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      next();
      return;
    }

    const token = parts[1];

    // 验证令牌
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
    if (!payload) {
      next();
      return;
    }

    // 将用户信息附加到请求对象
    req.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role || 'user',
      tokenNearExpiry: false
    };

    // 继续下一个中间件
    next();
  } catch (error) {
    // 忽略错误，继续下一个中间件
    next();
  }
};

/**
 * 验证刷新令牌中间件
 */
export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ 
        success: false,
        message: '未提供刷新令牌' 
      });
      return;
    }

    // 验证刷新令牌
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as any;
    if (!payload) {
      res.status(401).json({ 
        success: false,
        message: '无效或已过期的刷新令牌' 
      });
      return;
    }

    // 将用户信息添加到请求对象
    req.user = {
      id: payload.id,
      username: payload.username,
      role: payload.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('验证刷新令牌错误:', error);
    res.status(500).json({ 
      success: false,
      message: '服务器错误，请稍后再试' 
    });
    return;
  }
};

/**
 * 验证管理员权限
 */
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ 
        success: false,
        message: '未授权，请先登录' 
      });
      return;
    }

    const user = await User.findByPk(parseInt(userId, 10));
    if (!user || user.role !== 'admin') {
      res.status(403).json({ 
        success: false,
        message: '无权限，需要管理员权限' 
      });
      return;
    }

    next();
  } catch (error) {
    console.error('验证管理员权限错误:', error);
    res.status(500).json({ 
      success: false,
      message: '服务器错误，请稍后再试' 
    });
    return;
  }
}; 