require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

// 从环境变量获取数据库配置
const dbName = process.env.DB_NAME || 'video_social';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '3306');
const dbDialect = process.env.DB_DIALECT || 'mysql';

// 创建Sequelize实例
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: console.log,
});

// 读取SQL脚本文件
const sqlFilePath = path.join(__dirname, '../../../database_setup.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

// 将SQL脚本分割成单独的语句
const statements = sqlScript
  .split(';')
  .filter(statement => statement.trim() !== '')
  .map(statement => statement.trim() + ';');

// 初始化数据库
async function initDatabase() {
  try {
    console.log('正在连接到数据库...');
    await sequelize.authenticate();
    console.log('数据库连接成功!');

    // 创建数据库
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`确保数据库 ${dbName} 存在`);

    // 使用创建的数据库
    await sequelize.query(`USE ${dbName};`);
    console.log(`正在使用数据库 ${dbName}`);

    // 执行所有SQL语句
    console.log('开始执行SQL脚本...');
    for (const statement of statements) {
      if (statement.includes('CREATE DATABASE') || statement.includes('USE video_social')) {
        continue; // 跳过已经执行的数据库创建和使用语句
      }
      await sequelize.query(statement);
    }

    console.log('数据库初始化成功!');
    
    // 加载所有模型以确保它们正确同步
    require('../models/User');
    require('../models/Video');
    require('../models/Comment');
    require('../models/Message');
    require('../models/ChatMessage');
    
    console.log('所有模型已加载并同步');

  } catch (error) {
    console.error('数据库初始化失败:', error);
  } finally {
    await sequelize.close();
    console.log('数据库连接已关闭');
  }
}

// 执行初始化
initDatabase(); 