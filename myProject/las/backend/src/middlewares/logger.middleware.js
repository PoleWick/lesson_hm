"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = exports.LogLevel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// 加载环境变量
dotenv_1.default.config();
// 日志级别
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// 日志配置
const logConfig = {
    logToConsole: process.env.LOG_TO_CONSOLE !== 'false',
    logToFile: process.env.LOG_TO_FILE !== 'false',
    logDir: process.env.LOG_DIR || 'logs',
    logLevel: (process.env.LOG_LEVEL || 'INFO'),
};
// 创建日志目录
const createLogDir = () => {
    const logDir = path_1.default.join(__dirname, '../../', logConfig.logDir);
    if (!fs_1.default.existsSync(logDir)) {
        fs_1.default.mkdirSync(logDir, { recursive: true });
    }
    return logDir;
};
// 日志文件写入器
const writeToLogFile = (logData) => {
    if (!logConfig.logToFile)
        return;
    const logDir = createLogDir();
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path_1.default.join(logDir, `${today}.log`);
    try {
        fs_1.default.appendFileSync(logFile, JSON.stringify(logData) + '\n');
    }
    catch (error) {
        console.error('写入日志文件错误:', error);
    }
};
// 生成日志数据
const formatLog = (req, res, level, message, error) => {
    var _a;
    return {
        timestamp: new Date().toISOString(),
        level,
        method: req.method,
        path: req.originalUrl || req.url,
        status: res.statusCode,
        responseTime: res.locals.responseTime,
        userId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 'anonymous',
        userIp: req.ip || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'],
        message,
        error: error ? {
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } : undefined
    };
};
// 打印日志到控制台
const logToConsole = (logData) => {
    if (!logConfig.logToConsole)
        return;
    const { level, method, path, status, responseTime, message } = logData;
    const logTime = new Date().toLocaleTimeString();
    // 根据级别设置颜色
    let coloredLevel = String(level);
    switch (level) {
        case LogLevel.INFO:
            coloredLevel = `\x1b[32m${level}\x1b[0m`; // 绿色
            break;
        case LogLevel.WARN:
            coloredLevel = `\x1b[33m${level}\x1b[0m`; // 黄色
            break;
        case LogLevel.ERROR:
            coloredLevel = `\x1b[31m${level}\x1b[0m`; // 红色
            break;
        case LogLevel.DEBUG:
            coloredLevel = `\x1b[36m${level}\x1b[0m`; // 青色
            break;
    }
    console.log(`[${logTime}] ${coloredLevel} ${method} ${path} ${status || '-'} ${responseTime ? responseTime + 'ms' : '-'} - ${message}`);
    if (logData.error && level === LogLevel.ERROR) {
        console.error(logData.error);
    }
};
// 请求日志中间件
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // 在响应对象上注册finish事件
    res.on('finish', () => {
        const responseTime = Date.now() - start;
        res.locals.responseTime = responseTime;
        const logData = formatLog(req, res, LogLevel.INFO, '请求完成', null);
        logToConsole(logData);
        writeToLogFile(logData);
    });
    next();
};
exports.requestLogger = requestLogger;
// 错误日志中间件
const errorLogger = (err, req, res, next) => {
    const logData = formatLog(req, res, LogLevel.ERROR, `错误: ${err.message}`, err);
    logToConsole(logData);
    writeToLogFile(logData);
    next(err);
};
exports.errorLogger = errorLogger;
