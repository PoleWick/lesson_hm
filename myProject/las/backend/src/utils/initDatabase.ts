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
  // 检查是否已初始化，避免重复初始化
  if (checkIfInitialized()) {
    console.log('数据库已初始化，跳过初始化步骤');
    return true;
  }

  try {
    // 创建上传目录
    createUploadDirs();

    // 连接数据库
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 检查是否禁用数据库同步
    const disableDbSync = process.env.DISABLE_DB_SYNC === 'true';
    
    if (disableDbSync) {
      console.log('数据库同步已禁用，使用已存在的数据库表结构');
    } else {
      // 注释掉SQL脚本执行部分，因为已经手动创建了表
      /*
      try {
        const sqlFilePath = path.join(__dirname, '../../../database_setup.sql');
        if (fs.existsSync(sqlFilePath)) {
          console.log('找到SQL脚本文件，开始执行...');
          const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
          
          // 将SQL脚本分割成单独的语句
          const statements = sqlScript
            .split(';')
            .filter(statement => statement.trim() !== '')
            .map(statement => statement.trim() + ';');
          
          // 执行SQL语句（跳过创建数据库和USE语句）
          for (const statement of statements) {
            if (statement.includes('CREATE DATABASE') || 
                statement.includes('USE video_social')) {
              continue; // 只跳过数据库创建和使用语句
            }
            await sequelize.query(statement);
          }
          console.log('SQL脚本执行完成');
        } else {
          console.log('未找到SQL脚本文件，将使用Sequelize同步模式');
        }
      } catch (sqlError) {
        console.error('执行SQL脚本时出错:', sqlError);
        console.log('将使用Sequelize同步模式作为备选方案');
      }
      */

      // 禁用Sequelize同步，表结构已手动创建
      // await sequelize.sync({ force: false });
      console.log('使用已存在的数据库表结构，跳过模型同步');
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