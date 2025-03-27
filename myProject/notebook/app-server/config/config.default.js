/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

require('dotenv').config();

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1740482442560_5857';

  // add your middleware config here
  config.middleware = [];

  // 添加API前缀配置
  config.prefix = '/api';

  // 安全性和CORS配置
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:5173']
  }

  config.cors = {
    origin: 'http://localhost:5173',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }

  // 文件上传配置
  config.multipart = {
    mode: 'file',
    fileSize: '200kb',
    whitelist: ['.jpg', '.jpeg', '.png']
  }
  // 加密
  config.jwt = {
    secret: '!%shunwuyu123$',
    refreshSecret: '!%shunwuyu123$_refresh'
  }
  // LLM API配置
  config.llm = {
    baseURL: process.env.BASE_URL,
    apiKey: process.env.OPENAI_API_KEY || '',
    defaultModel: 'deepseek-chat',
    defaultTemperature: 0.7
  }

  // 数据库配置
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: '3306',
    database: 'zhangben',
    username: 'root',
    password: '123456',
    define: {
      timestamps: false, // 自动生成时间戳
      freezeTableName: true, // 表名不自动加s
      underscored: true, // 驼峰转下划线
    }
  }

  // 配置服务器监听端口
  config.cluster = {
    listen: {
      port: 7002
    }
  };
  config.cors = {
    origin: 'http://localhost:5173',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 600
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig
  };
};