import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/rbac.middleware';

const router = Router();

// 公共路由
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// 需要身份验证的路由
router.post('/change-password', verifyToken, authController.changePassword);

// 仅管理员可访问的路由
router.post('/reset-password', verifyToken, isAdmin, authController.resetPassword);

export default router; 