"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwnerOrAdmin = exports.hasRole = exports.isSystemUser = exports.isResourceOwner = exports.hasPermission = exports.isAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const error_middleware_1 = require("./error.middleware");
const apiResponse_1 = require("../utils/apiResponse");
// 角色等级
var RoleLevel;
(function (RoleLevel) {
    RoleLevel[RoleLevel["USER"] = 1] = "USER";
    RoleLevel[RoleLevel["ADMIN"] = 2] = "ADMIN";
    RoleLevel[RoleLevel["SYSTEM"] = 3] = "SYSTEM";
})(RoleLevel || (RoleLevel = {}));
// 将角色字符串转换为等级
const getRoleLevel = (role) => {
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
/**
 * 检查用户是否为管理员
 * 必须在verifyToken中间件之后使用
 */
const isAdmin = (req, res, next) => {
    try {
        const user = req.user;
        // 确保用户存在且已通过身份验证
        if (!user) {
            return (0, apiResponse_1.error)(res, '未经授权的访问', 401);
        }
        // 检查用户角色
        if (user.role !== 'admin') {
            return (0, apiResponse_1.error)(res, '权限不足，需要管理员权限', 403);
        }
        // 继续下一个中间件
        next();
    }
    catch (err) {
        console.error('权限检查失败:', err);
        return (0, apiResponse_1.error)(res, '权限检查失败', 500);
    }
};
exports.isAdmin = isAdmin;
/**
 * 检查用户是否有特定权限
 * @param permission 所需权限
 */
const hasPermission = (permission) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            // 确保用户存在且已通过身份验证
            if (!user) {
                return (0, apiResponse_1.error)(res, '未经授权的访问', 401);
            }
            // 管理员拥有所有权限
            if (user.role === 'admin') {
                return next();
            }
            // 此处可以实现基于权限的检查逻辑
            // 例如，从数据库中查询用户的权限列表
            const userPermissions = ['read:profile', 'update:profile']; // 模拟用户权限
            if (userPermissions.includes(permission)) {
                return next();
            }
            return (0, apiResponse_1.error)(res, '权限不足，需要特定权限', 403);
        }
        catch (err) {
            console.error('权限检查失败:', err);
            return (0, apiResponse_1.error)(res, '权限检查失败', 500);
        }
    };
};
exports.hasPermission = hasPermission;
/**
 * 检查资源所有权
 * 用于确保用户只能访问/修改自己的资源
 * @param getResourceOwnerId 从请求中获取资源所有者ID的函数
 */
const isResourceOwner = (getResourceOwnerId) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = req.user;
            // 确保用户存在且已通过身份验证
            if (!user) {
                return (0, apiResponse_1.error)(res, '未经授权的访问', 401);
            }
            // 管理员可以访问所有资源
            if (user.role === 'admin') {
                return next();
            }
            // 获取资源所有者ID
            const ownerId = yield getResourceOwnerId(req);
            // 如果找不到资源或所有者
            if (!ownerId) {
                return (0, apiResponse_1.error)(res, '资源不存在', 404);
            }
            // 检查当前用户是否为资源所有者
            if (user.id !== ownerId) {
                return (0, apiResponse_1.error)(res, '权限不足，您无权访问此资源', 403);
            }
            // 继续下一个中间件
            next();
        }
        catch (err) {
            console.error('所有权检查失败:', err);
            return (0, apiResponse_1.error)(res, '所有权检查失败', 500);
        }
    });
};
exports.isResourceOwner = isResourceOwner;
/**
 * 检查用户是否拥有系统级权限
 */
const isSystemUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw new error_middleware_1.ApiError(401, '未授权，请先登录');
        }
        const user = yield User_1.default.findByPk(userId);
        if (!user) {
            throw new error_middleware_1.ApiError(404, '用户不存在');
        }
        if (user.role !== 'system') {
            throw new error_middleware_1.ApiError(403, '权限不足，需要系统权限');
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isSystemUser = isSystemUser;
/**
 * 检查用户是否拥有指定的最低角色等级
 * @param minRole 最低角色等级
 */
const hasRole = (minRole) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_middleware_1.ApiError(401, '未授权，请先登录');
            }
            const user = yield User_1.default.findByPk(userId);
            if (!user) {
                throw new error_middleware_1.ApiError(404, '用户不存在');
            }
            const userRoleLevel = getRoleLevel(user.role);
            const requiredRoleLevel = getRoleLevel(minRole);
            if (userRoleLevel < requiredRoleLevel) {
                throw new error_middleware_1.ApiError(403, `权限不足，需要${minRole}或更高权限`);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.hasRole = hasRole;
/**
 * 检查用户是否是资源所有者或管理员
 * @param getResourceUserId 从请求中获取资源所有者ID的函数
 */
const isOwnerOrAdmin = (getResourceUserId) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new error_middleware_1.ApiError(401, '未授权，请先登录');
            }
            const user = yield User_1.default.findByPk(userId);
            if (!user) {
                throw new error_middleware_1.ApiError(404, '用户不存在');
            }
            // 管理员和系统用户拥有所有权限
            if (user.role === 'admin' || user.role === 'system') {
                return next();
            }
            // 获取资源所有者ID
            const resourceUserId = yield getResourceUserId(req);
            // 如果无法确定资源所有者
            if (resourceUserId === null) {
                throw new error_middleware_1.ApiError(404, '资源不存在');
            }
            // 检查当前用户是否是资源所有者
            if (userId !== resourceUserId) {
                throw new error_middleware_1.ApiError(403, '权限不足，您不是该资源的所有者');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.isOwnerOrAdmin = isOwnerOrAdmin;
