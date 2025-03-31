/**
 * 专门用于初始化数据库的脚本
 * 使用方法: node initdb.js
 */

require('dotenv').config();

// 临时设置环境变量以执行数据库初始化脚本
process.env.RUN_DB_SETUP = 'true';

// 导入并执行数据库初始化函数
const initDatabase = require('./dist/utils/initDatabase').default;

initDatabase()
  .then(() => {
    console.log('数据库初始化完成！');
    process.exit(0);
  })
  .catch(err => {
    console.error('数据库初始化失败:', err);
    process.exit(1);
  }); 