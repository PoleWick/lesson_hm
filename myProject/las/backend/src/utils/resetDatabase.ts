import fs from 'fs';
import path from 'path';

// 数据库锁文件路径
const DB_LOCK_FILE = path.join(__dirname, '../../.db_initialized');

// 删除锁文件
const resetDatabaseLock = () => {
  if (fs.existsSync(DB_LOCK_FILE)) {
    try {
      fs.unlinkSync(DB_LOCK_FILE);
      console.log('数据库锁文件已删除，系统将在下次启动时重新初始化数据库');
      return true;
    } catch (error) {
      console.error('删除数据库锁文件失败:', error);
      return false;
    }
  } else {
    console.log('数据库锁文件不存在，无需重置');
    return false;
  }
};

// 作为模块导出
export default resetDatabaseLock;

// 直接执行
if (require.main === module) {
  resetDatabaseLock();
} 