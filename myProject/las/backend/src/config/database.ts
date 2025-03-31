import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

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
  dialect: dbDialect as any,
  // 只在明确启用时输出日志
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // 禁用自动重连
  retry: {
    max: 0
  },
  // 自动设置时区
  timezone: '+08:00'
});

export default sequelize; 