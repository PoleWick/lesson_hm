/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
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

  // 安全性
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
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


  // 跨域
  config.cors = {
    origin: '*', // 允许所有域名访问，生产环境建议设置具体域名
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'X-Requested-By'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 86400
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