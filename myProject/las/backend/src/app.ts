import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import videoRoutes from './routes/videoRoutes';
import commentRoutes from './routes/commentRoutes';
import chatRoutes from './routes/chatRoutes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import { setupSwagger } from './middlewares/swagger.middleware';
import { config } from './config/config';
import initDatabase from './utils/initDatabase';
import { initializeSocket } from './websocket/socketServer';

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 根据环境配置日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API路由
app.use('/api', userRoutes);
app.use('/api', messageRoutes);
app.use('/api', videoRoutes);
app.use('/api', commentRoutes);
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);

// API文档（非生产环境）
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// 错误处理中间件
app.use(errorHandler);

// 端口配置
const PORT = config.port || 3000;

// 服务器实例
let server: any = null;

// 初始化并启动服务器
const startServer = async () => {
  try {
    // 初始化数据库
    await initDatabase();
    
    // 启动服务器
    server = app.listen(PORT, () => {
      console.log(`服务器运行在: http://localhost:${PORT}`);
    });
    
    // 初始化WebSocket服务
    initializeSocket(server);
    
    // 添加优雅关闭处理
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
    return server;
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

// 优雅关闭服务器
const gracefulShutdown = () => {
  console.log('正在关闭服务器...');
  if (server) {
    server.close(() => {
      console.log('服务器已关闭');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// 启动服务器
startServer();

export default app; 