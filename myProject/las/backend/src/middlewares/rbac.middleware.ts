import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { ApiError } from './error.middleware';
import { error } from '../utils/apiResponse';

// 角色等级
enum RoleLevel {
  USER = 1,
  ADMIN = 2,
  SYSTEM = 3
}

// 将角色字符串转换为等级
const getRoleLevel = (role: string): number => {
  switch (role) {
    case 'admin':
      return RoleLevel.ADMIN;
    case 'system':
      return RoleLevel.SYSTEM;
    case 'user':
    default:
      return RoleLevel.USER;
  }
};

// 权限映射表
const PERMISSION_MAP: Record<string, string[]> = {
  'user': [
    'read:profile', 'update:profile', 
    'create:message', 'read:message', 'update:own:message', 'delete:own:message',
    'create:comment', 'read:comment', 'update:own:comment', 'delete:own:comment',
    'create:like', 'delete:own:like'
  ],
  'admin': [
    'read:profile', 'update:profile', 
    'create:message', 'read:message', 'update:message', 'delete:message',
    'create:comment', 'read:comment', 'update:comment', 'delete:comment',
    'create:like', 'delete:like',
    'read:users', 'update:user:role',
    'manage:content'
  ],
  'system': [
    'read:profile', 'update:profile', 
    'create:message', 'read:message', 'update:message', 'delete:message',
    'create:comment', 'read:comment', 'update:comment', 'delete:comment',
    'create:like', 'delete:like',
    'read:users', 'update:user', 'delete:user', 'update:user:role',
    'manage:content', 'manage:system'
  ]
};

/**
 * 检查用户是否为管理员
 * 必须在verifyToken中间件之后使用
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = req.user;
    
    // 确保用户存在且已通过身份验证
    if (!user) {
      error(res, '未经授权的访问', 401);
      return;
    }
    
    // 检查用户角色
    if (user.role !== 'admin' && user.role !== 'system') {
      error(res, '权限不足，需要管理员权限', 403);
      return;
    }
    
    // 继续下一个中间件
    next();
  } catch (err) {
    console.error('权限检查失败:', err);
    error(res, '权限检查失败', 500);
    return;
  }
};

/**
 * 检查用户是否有特定权限
 * @param permission 所需权限
 */
export const hasPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;
      
      // 确保用户存在且已通过身份验证
      if (!user) {
        error(res, '未经授权的访问', 401);
        return;
      }
      
      // 获取用户角色
      const role = user.role || 'user';
      
      // 获取角色对应的权限列表
      const permissions = PERMISSION_MAP[role] || [];
      
      // 检查是否拥有所需权限
      if (permissions.includes(permission) || role === 'admin' || role === 'system') {
        next();
        return;
      }
      
      error(res, `权限不足，需要 ${permission} 权限`, 403);
      return;
    } catch (err) {
      console.error('权限检查失败:', err);
      error(res, '权限检查失败', 500);
      return;
    }
  };
};

/**
 * 检查资源所有权
 * 用于确保用户只能访问/修改自己的资源
 * @param getResourceOwnerId 从请求中获取资源所有者ID的函数
 */
export const isResourceOwner = (
  getResourceOwnerId: (req: Request) => Promise<string | null>
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      
      // 确保用户存在且已通过身份验证
      if (!user) {
        error(res, '未经授权的访问', 401);
        return;
      }
      
      // 管理员和系统用户可以访问所有资源
      if (user.role === 'admin' || user.role === 'system') {
        next();
        return;
      }
      
      // 获取资源所有者ID
      const ownerId = await getResourceOwnerId(req);
      
      // 如果找不到资源或所有者
      if (!ownerId) {
        error(res, '资源不存在', 404);
        return;
      }
      
      // 检查当前用户是否为资源所有者
      if (user.id !== ownerId) {
        error(res, '权限不足，您无权访问此资源', 403);
        return;
      }
      
      // 继续下一个中间件
      next();
    } catch (err) {
      console.error('所有权检查失败:', err);
      error(res, '所有权检查失败', 500);
      return;
    }
  };
};

/**
 * 检查用户是否拥有系统级权限
 */
export const isSystemUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, '未授权，请先登录');
    }

    const user = await User.findByPk(parseInt(userId, 10));
    if (!user) {
      throw new ApiError(404, '用户不存在');
    }

    if (user.role !== 'system') {
      throw new ApiError(403, '权限不足，需要系统权限');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 检查用户是否拥有指定的最低角色等级
 * @param minRole 最低角色等级
 */
export const hasRole = (minRole: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, '未授权，请先登录');
      }

      const user = await User.findByPk(parseInt(userId, 10));
      if (!user) {
        throw new ApiError(404, '用户不存在');
      }

      const userRoleLevel = getRoleLevel(user.role);
      const requiredRoleLevel = getRoleLevel(minRole);

      if (userRoleLevel < requiredRoleLevel) {
        throw new ApiError(403, `权限不足，需要${minRole}或更高权限`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * 检查用户是否是资源所有者或管理员
 * @param getResourceUserId 从请求中获取资源所有者ID的函数
 */
export const isOwnerOrAdmin = (getResourceUserId: (req: Request) => Promise<string | null>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, '未授权，请先登录');
      }

      const user = await User.findByPk(parseInt(userId, 10));
      if (!user) {
        throw new ApiError(404, '用户不存在');
      }

      // 管理员和系统用户拥有所有权限
      if (user.role === 'admin' || user.role === 'system') {
        next();
        return;
      }

      // 获取资源所有者ID
      const resourceUserId = await getResourceUserId(req);
      
      // 如果无法确定资源所有者
      if (resourceUserId === null) {
        throw new ApiError(404, '资源不存在');
      }

      // 检查当前用户是否是资源所有者
      if (userId !== resourceUserId) {
        throw new ApiError(403, '权限不足，您不是该资源的所有者');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 