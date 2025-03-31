"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
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
        const dirPath = path_1.default.join(__dirname, '../../', dir);
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
    });
};
// 初始化数据库
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 创建上传目录
        createUploadDirs();
        // 连接数据库
        yield database_1.default.authenticate();
        console.log('数据库连接成功');
        // 创建数据库表（如果不存在）
        // 尝试读取并执行SQL脚本
        try {
            const sqlFilePath = path_1.default.join(__dirname, '../../../database_setup.sql');
            // 添加环境变量检查，只在明确指定时执行SQL脚本
            const shouldRunSqlScript = process.env.RUN_DB_SETUP === 'true';
            
            if (fs_1.default.existsSync(sqlFilePath) && shouldRunSqlScript) {
                console.log('找到SQL脚本文件，开始执行...');
                const sqlScript = fs_1.default.readFileSync(sqlFilePath, 'utf8');
                // 将SQL脚本分割成单独的语句
                const statements = sqlScript
                    .split(';')
                    .filter(statement => statement.trim() !== '')
                    .map(statement => statement.trim() + ';');
                // 执行SQL语句（跳过创建数据库和USE语句，以及INSERT语句）
                for (const statement of statements) {
                    if (statement.includes('CREATE DATABASE') ||
                        statement.includes('USE video_social') ||
                        statement.includes('INSERT INTO')) {
                        continue; // 跳过数据库创建、使用和插入语句
                    }
                    yield database_1.default.query(statement);
                }
                console.log('SQL脚本执行完成');
            }
            else {
                console.log('未找到SQL脚本文件，将使用Sequelize同步模式');
            }
        }
        catch (sqlError) {
            console.error('执行SQL脚本时出错:', sqlError);
            console.log('将使用Sequelize同步模式作为备选方案');
        }
        // 导入所有模型，确保关联关系已经在各自的模型文件中定义
        // 注意：关联关系应该在各模型文件中定义，避免重复定义
        // 同步数据库模型（如果表不存在则创建）
        yield database_1.default.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('数据库模型同步成功');
        return true;
    }
    catch (error) {
        console.error('数据库初始化错误:', error);
        throw error;
    }
});
// 作为模块导出
exports.default = initDatabase;
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
