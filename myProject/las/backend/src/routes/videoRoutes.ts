import express from 'express';
const router = express.Router();

// 简单的状态检查接口
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    message: '视频路由可用'
  });
});

export default router; 