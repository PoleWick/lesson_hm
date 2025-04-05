import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { 
  getAllMessages, 
  createMessage, 
  getMessageById, 
  updateMessage, 
  deleteMessage, 
  likeMessage, 
  getMessageComments 
} from '../controllers/message.controller';
import { imageUpload, handleUploadError } from '../middlewares/upload.middleware';

const router = express.Router();

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: 获取所有留言
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: 每页数量
 */
router.get('/messages', getAllMessages);

/**
 * @swagger
 * /messages/create:
 *   post:
 *     summary: 创建新留言
 *     security:
 *       - bearerAuth: []
 */
router.post('/messages/create', 
  verifyToken, 
  imageUpload.single('file'), 
  handleUploadError, 
  createMessage
);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: 获取留言详情
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/messages/:id', getMessageById);

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     summary: 更新留言
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put('/messages/:id', verifyToken, updateMessage);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: 删除留言
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/messages/:id', verifyToken, deleteMessage);

/**
 * @swagger
 * /messages/{id}/like:
 *   post:
 *     summary: 点赞留言
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.post('/messages/:id/like', likeMessage);

/**
 * @swagger
 * /messages/{id}/comments:
 *   get:
 *     summary: 获取留言的评论
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/messages/:id/comments', getMessageComments);

// 简单的状态检查接口
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: '消息路由可用'
  });
});

export default router; 