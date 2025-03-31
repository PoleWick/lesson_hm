import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 日志级别
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

// 日志格式
interface LogFormat {
  timestamp: string;
  level: LogLevel;
  method: string;
  path: string;
  status?: number;
  responseTime?: number;
  userId?: string;
  userIp: string;
  userAgent?: string;
  message: string;
  error?: any;
}

// 日志配置
const logConfig = {
  logToConsole: process.env.LOG_TO_CONSOLE !== 'false',
  logToFile: process.env.LOG_TO_FILE !== 'false',
  logDir: process.env.LOG_DIR || 'logs',
  logLevel: (process.env.LOG_LEVEL || 'INFO') as LogLevel,
};

// 创建日志目录
const createLogDir = () => {
  const logDir = path.join(__dirname, '../../', logConfig.logDir);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  return logDir;
};

// 日志文件写入器
const writeToLogFile = (logData: LogFormat) => {
  if (!logConfig.logToFile) return;
  
  const logDir = createLogDir();
  const today = new Date().toISOString().slice(0, 10);
  const logFile = path.join(logDir, `${today}.log`);
  
  try {
    fs.appendFileSync(logFile, JSON.stringify(logData) + '\n');
  } catch (error) {
    console.error('写入日志文件错误:', error);
  }
};

// 生成日志数据
const formatLog = (req: Request, res: Response, level: LogLevel, message: string, error?: any): LogFormat => {
  return {
    timestamp: new Date().toISOString(),
    level,
    method: req.method,
    path: req.originalUrl || req.url,
    status: res.statusCode,
    responseTime: res.locals.responseTime,
    userId: (req as any).user?.id || 'anonymous',
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
const logToConsole = (logData: LogFormat) => {
  if (!logConfig.logToConsole) return;
  
  const { level, method, path, status, responseTime, message } = logData;
  const logTime = new Date().toLocaleTimeString();
  
  // 根据级别设置颜色
  let coloredLevel: string = String(level);
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
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
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

// 错误日志中间件
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  const logData = formatLog(
    req, 
    res, 
    LogLevel.ERROR, 
    `错误: ${err.message}`,
    err
  );
  
  logToConsole(logData);
  writeToLogFile(logData);
  
  next(err);
}; 