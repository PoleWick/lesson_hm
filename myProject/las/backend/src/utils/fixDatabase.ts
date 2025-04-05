import sequelize from '../config/database';
import fs from 'fs';
import path from 'path';

// 手动修复messages表
const fixMessagesTable = async () => {
  try {
    // 检查messages表是否存在
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'messages'");
    const tableExists = (tables as any[]).length > 0;
    
    if (tableExists) {
      console.log('删除现有messages表...');
      // 先关闭外键检查
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // 删除表
      await sequelize.query('DROP TABLE IF EXISTS messages');
      
      console.log('messages表已删除');
    }
    
    // 创建新的messages表
    console.log('创建新的messages表...');
    await sequelize.query(`
      CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        subtitle VARCHAR(200),
        content TEXT NOT NULL,
        color VARCHAR(20) DEFAULT '#ffffff',
        userId INT NOT NULL,
        likes INT DEFAULT 0,
        mediaUrl VARCHAR(255),
        mediaType VARCHAR(20),
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    
    // 重新启用外键检查
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('messages表已成功创建');
    return true;
  } catch (error) {
    console.error('修复messages表出错:', error);
    throw error;
  }
};

// 直接执行
if (require.main === module) {
  fixMessagesTable()
    .then(() => {
      console.log('数据库修复完成，程序退出');
      process.exit(0);
    })
    .catch(err => {
      console.error('数据库修复失败:', err);
      process.exit(1);
    });
}

export default fixMessagesTable; 