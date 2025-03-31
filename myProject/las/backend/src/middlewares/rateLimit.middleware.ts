import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';

// 简单的内存存储
interface IRateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// 存储请求计数
const requestCounts: IRateLimitStore = {};

/**
 * 清理过期的限制记录
 */
const cleanupExpiredEntries = () => {
  const now = Date.now();
  Object.keys(requestCounts).forEach(key => {
    if (requestCounts[key].resetTime <= now) {
      delete requestCounts[key];
    }
  });
};

// 定期清理过期记录
setInterval(cleanupExpiredEntries, 60000); // 每分钟清理一次

/**
 * 限流中间件
 * @param maxRequests 在时间窗口内允许的最大请求数
 * @param windowMs 时间窗口大小（毫秒）
 * @param message 限流时返回的消息
 */
export const rateLimit = (
  maxRequests: number = 100,
  windowMs: number = 60000, // 默认1分钟
  message: string = '请求过多，请稍后再试'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 获取客户端IP地址作为键
    const clientIp = (
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      'unknown'
    ) as string;
    
    // 为不同的路由设置不同的限制，使用路径作为键的一部分
    const routePath = req.path;
    const key = `${clientIp}:${routePath}`;
    
    const now = Date.now();
    
    // 如果是新请求或限制已重置
    if (!requestCounts[key] || requestCounts[key].resetTime <= now) {
      requestCounts[key] = {
        count: 1,
        resetTime: now + windowMs
      };
      return next();
    }
    
    // 增加计数
    requestCounts[key].count += 1;
    
    // 设置响应头，提供限流信息
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestCounts[key].count));
    res.setHeader('X-RateLimit-Reset', requestCounts[key].resetTime);
    
    // 如果超过限制
    if (requestCounts[key].count > maxRequests) {
      // 计算重置前剩余时间（秒）
      const retryAfter = Math.ceil((requestCounts[key].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      
      const error = new ApiError(429, message);
      return next(error);
    }
    
    next();
  };
};

/**
 * 为不同的API路由创建限流配置
 */
export const apiLimiter = rateLimit(100, 60000, '请求过多，请稍后再试');

/**
 * 为登录/注册API创建更严格的限流配置
 */
export const authLimiter = rateLimit(5, 60000, '尝试次数过多，请1分钟后再试');

/**
 * 为文件上传API创建限流配置
 */
export const uploadLimiter = rateLimit(10, 300000, '上传次数过多，请5分钟后再试'); 