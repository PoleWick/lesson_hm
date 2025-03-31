"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const swagger_middleware_1 = require("./middlewares/swagger.middleware");
const config_1 = require("./config/config");
const initDatabase_1 = __importDefault(require("./utils/initDatabase"));
const socketServer_1 = require("./websocket/socketServer");
// 创建Express应用
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// 静态文件服务
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// API路由
app.use('/api', userRoutes_1.default);
app.use('/api', messageRoutes_1.default);
app.use('/api', videoRoutes_1.default);
app.use('/api', commentRoutes_1.default);
app.use('/api', chatRoutes_1.default);
// API文档（非生产环境）
if (process.env.NODE_ENV !== 'production') {
    (0, swagger_middleware_1.setupSwagger)(app);
}
// 错误处理中间件
app.use(error_middleware_1.errorHandler);
// 端口配置
const PORT = config_1.config.port || 3000;
// 初始化数据库并启动服务器
(0, initDatabase_1.default)()
    .then(() => {
    const server = app.listen(PORT, () => {
        console.log(`服务器运行在: http://localhost:${PORT}`);
    });
    // 初始化WebSocket服务
    (0, socketServer_1.initializeSocket)(server);
})
    .catch(error => {
    console.error('数据库初始化失败，无法启动服务器:', error);
    process.exit(1);
});
exports.default = app;
