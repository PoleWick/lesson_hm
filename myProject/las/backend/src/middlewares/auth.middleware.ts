import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { verifyAccessToken } from '../utils/jwt.utils';
import { error } from '../utils/apiResponse';

// 扩展Request接口，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
      };
    }
  }
}

/**
 * 验证请求头中的JWT令牌
 * 如果有效，将解码后的用户信息添加到req.user
 */
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return error(res, '未提供访问令牌', 401);
    }

    // 检查令牌格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return error(res, '访问令牌格式无效', 401);
    }

    const token = parts[1];
    const payload = verifyAccessToken(token);
    
    if (!payload) {
      return error(res, '访问令牌无效或已过期', 401);
    }

    // 将用户信息添加到请求对象
    (req as any).user = payload;
    
    // 继续下一个中间件
    next();
  } catch (err) {
    console.error('令牌验证失败:', err);
    return error(res, '令牌验证失败', 401);
  }
};

/**
 * 可选的令牌验证
 * 如果令牌有效，将用户信息添加到req.user
 * 如果没有令牌或令牌无效，仍然继续处理请求
 */
export const optionalToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    // 检查令牌格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const payload = verifyAccessToken(token);
    
    if (payload) {
      // 将用户信息添加到请求对象
      (req as any).user = payload;
    }
    
    // 继续下一个中间件
    next();
  } catch (err) {
    // 即使验证失败也继续处理请求
    next();
  }
};

// 验证刷新令牌
export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: '未提供刷新令牌' });
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshTokenSecret';

    jwt.verify(refreshToken, refreshTokenSecret, (err: jwt.VerifyErrors | null, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: '无效的刷新令牌' });
      }

      // 将解码后的用户信息添加到请求对象
      req.user = decoded as { id: number; username: string };
      next();
    });
  } catch (error) {
    console.error('验证刷新令牌错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
};

// 验证管理员权限
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权，请先登录' });
    }

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: '无权限，需要管理员权限' });
    }

    next();
  } catch (error) {
    console.error('验证管理员权限错误:', error);
    return res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
}; 