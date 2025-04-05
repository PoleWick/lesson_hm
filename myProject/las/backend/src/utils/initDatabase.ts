import sequelize from '../config/database';
import User from '../models/User';
import Message from '../models/Message';
import Video from '../models/Video';
import Comment from '../models/Comment';
import ChatMessage from '../models/ChatMessage';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// 加载环境变量
dotenv.config();

// 用于防止重复初始化的标志
let isInitialized = false;
const DB_LOCK_FILE = path.join(__dirname, '../../.db_initialized');

// 检查数据库是否已初始化
const checkIfInitialized = () => {
  // 检查内存中的标志
  if (isInitialized) {
    return true;
  }
  
  // 检查文件锁
  if (fs.existsSync(DB_LOCK_FILE)) {
    isInitialized = true;
    return true;
  }
  
  return false;
};

// 标记数据库为已初始化
const markAsInitialized = () => {
  isInitialized = true;
  // 创建文件锁
  fs.writeFileSync(DB_LOCK_FILE, new Date().toISOString());
};

// 创建上传目录
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/avatars',
    'uploads/images',
    'uploads/videos',
    'uploads/chunks'
  ];

  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '../../', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
};

// 创建默认用户
const createDefaultUsers = async () => {
  try {
    // 检查是否已有管理员用户
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      console.log('创建管理员用户...');
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // 会在Model的hooks中自动哈希
        role: 'admin'
      });
    }
    
    // 检查是否已有普通用户
    const userExists = await User.findOne({ where: { username: 'user1' } });
    if (!userExists) {
      console.log('创建测试用户...');
      await User.create({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123', // 会在Model的hooks中自动哈希
        role: 'user'
      });
    }
    
    console.log('默认用户创建完成');
  } catch (error) {
    console.error('创建默认用户出错:', error);
  }
};

// 初始化数据库
const initDatabase = async () => {
  // 强制禁用初始化检查，确保每次都重建数据库
  // if (checkIfInitialized()) {
  //  console.log('数据库已初始化，跳过初始化步骤');
  //  return true;
  // }

  try {
    // 创建上传目录
    createUploadDirs();

    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 检查是否禁用数据库同步
    const disableDbSync = false; // 强制启用数据库同步
    
    if (disableDbSync) {
      console.log('数据库同步已禁用，使用已存在的数据库表结构');
    } else {
      console.log('使用Sequelize同步模式');
      
      // 禁用外键检查，以允许删除有外键约束的表
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      console.log('临时禁用外键检查');
      
      try {
        // 使用force:true彻底重建数据库表
        await sequelize.sync({ force: true });
        console.log('数据库表结构已重建');
      } finally {
        // 重新启用外键检查
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('重新启用外键检查');
      }
    }
    
    // 创建默认用户（如果不存在）
    await createDefaultUsers();

    // 标记数据库为已初始化
    markAsInitialized();
    console.log('数据库初始化完成');

    return true;
  } catch (error) {
    console.error('数据库初始化错误:', error);
    throw error;
  }
};

// 作为模块导出
export default initDatabase;

// 如果直接运行脚本，则执行初始化
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('数据库初始化完成，程序退出');
      process.exit(0);
    })
    .catch(err => {
      console.error('数据库初始化失败:', err);
      process.exit(1);
    });
} 