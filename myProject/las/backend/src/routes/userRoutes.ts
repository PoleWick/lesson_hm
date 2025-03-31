import express from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  getUserInfo, 
  updateUserInfo, 
  getAllUsers, 
  changeUserRole 
} from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/rbac.middleware';
import { authLimiter } from '../middlewares/rateLimit.middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: 认证
 *   description: 用户认证相关API
 */

/**
 * @swagger
 * tags:
 *   name: 用户
 *   description: 用户管理相关API
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 注册新用户
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 用户注册成功
 *       400:
 *         description: 请求参数错误
 *       409:
 *         description: 用户名或邮箱已存在
 */
router.post('/auth/register', authLimiter, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功
 *       401:
 *         description: 用户名或密码错误
 */
router.post('/auth/login', authLimiter, login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 刷新访问令牌
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 令牌刷新成功
 *       401:
 *         description: 刷新令牌无效或已过期
 */
router.post('/auth/refresh', refreshToken);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 获取当前用户信息
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 用户信息获取成功
 *       401:
 *         description: 未授权
 */
router.get('/users/me', verifyToken, getUserInfo);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: 更新当前用户信息
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: 用户信息更新成功
 *       401:
 *         description: 未授权
 */
router.patch('/users/me', verifyToken, updateUserInfo);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 获取所有用户列表（管理员）
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码（默认1）
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量（默认10）
 *     responses:
 *       200:
 *         description: 用户列表获取成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 */
router.get('/users', verifyToken, isAdmin, getAllUsers);

/**
 * @swagger
 * /users/{userId}/role:
 *   patch:
 *     summary: 更改用户角色（管理员）
 *     tags: [用户]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: 用户角色更改成功
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 用户不存在
 */
router.patch('/users/:userId/role', verifyToken, isAdmin, changeUserRole);

// 简单的状态检查接口
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: '用户路由可用'
  });
});

export default router; 