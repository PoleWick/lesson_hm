import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 获取JWT配置
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'accessTokenSecret';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refreshTokenSecret';
const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE || '1h';
const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE || '7d';

// Token载荷接口
export interface TokenPayload {
  id: string;
  username: string;
  role?: string;
}

/**
 * 生成访问令牌
 * @param payload 令牌载荷
 * @returns 生成的JWT访问令牌
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: accessTokenExpire };
  return jwt.sign(payload, accessTokenSecret, options);
};

/**
 * 生成刷新令牌
 * @param payload 令牌载荷
 * @returns 生成的JWT刷新令牌
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: refreshTokenExpire };
  return jwt.sign(payload, refreshTokenSecret, options);
};

/**
 * 验证访问令牌
 * @param token JWT访问令牌
 * @returns 解码后的载荷或null（如果验证失败）
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, accessTokenSecret) as TokenPayload;
  } catch (error) {
    console.error('访问令牌验证失败:', error);
    return null;
  }
};

/**
 * 验证刷新令牌
 * @param token JWT刷新令牌
 * @returns 解码后的载荷或null（如果验证失败）
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, refreshTokenSecret) as TokenPayload;
  } catch (error) {
    console.error('刷新令牌验证失败:', error);
    return null;
  }
};

/**
 * 为用户生成访问令牌和刷新令牌
 * @param payload 用户信息载荷
 * @returns 包含访问令牌和刷新令牌的对象
 */
export const generateTokens = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
}; 