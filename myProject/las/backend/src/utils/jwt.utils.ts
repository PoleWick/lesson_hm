import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 令牌配置
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15分钟
const REFRESH_TOKEN_EXPIRY = '7d'; // 7天
const TOKEN_EXPIRY_WARNING = 5 * 60; // 令牌过期前5分钟开始警告

// 令牌有效载荷接口
export interface TokenPayload {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * 生成访问令牌和刷新令牌
 */
export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  
  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY
  };
};

/**
 * 验证访问令牌
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('访问令牌验证失败:', error);
    return null;
  }
};

/**
 * 验证刷新令牌
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('刷新令牌验证失败:', error);
    return null;
  }
};

/**
 * 检查访问令牌是否接近过期
 * 如果距离过期不到5分钟，返回true
 */
export const isAccessTokenNearExpiry = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (!decoded || !decoded.exp) return false;
    
    const expiryTime = decoded.exp * 1000; // 转换为毫秒
    const currentTime = Date.now();
    const timeToExpiry = expiryTime - currentTime;
    
    return timeToExpiry > 0 && timeToExpiry < TOKEN_EXPIRY_WARNING * 1000;
  } catch (error) {
    console.error('检查令牌过期失败:', error);
    return false;
  }
}; 