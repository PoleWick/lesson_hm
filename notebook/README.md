# React NoteBook 全栈

- npm i react-router-dom -S
  --save的简写 一直依赖 react-router-dom@7 
  --save-dev -D 开发阶段依赖

- 项目阶段
  - 开发阶段 development   vite 
  - 测试阶段 test 其他同事的电脑上 没有环境 npx
  - 上线阶段 production   打包-》 项目部署？-》 dns -》上线

- 编程风格
  - react 组件 由函数组件jsx 文件 + 样式文件css 组成 
    - 组件声明文件小写  名字叫index.jsx
    引入的时候 直接引入组件目录即可, 组件类的作用，同时不用去引入 index.jsx
  - return (JSX) dom树的对齐, 优雅

- 页面级别组件
  - 首页
    Home.vue 

- es6 module 的语法
  import React,{ useState } from 'react'
  default 解构的引入
  import React.useState from 'react'
  import * as React from'react'

  as 起别名

- key 的用法
  循环输出组件，需有给唯一的key 值需要唯一
  update 性能

- 选择框架
  - zarm 移动端 react ui组件库
    指定3.1.2版本 npm i zarm@3.1.2
  - 引入组件 button
  - 引入样式
  - 引入配置ConfigProvider theme primaryColor
  - 主题定制 theme primaryColor
- npm run build
  - 上线之前先打包
  - dist/ 结果目录
    - src/ 开发目录
      代码质量和可读性
    - 不需要注释、换行等 只要浏览器能运行就好
      文件小，压缩，传输更快
    - 组件打包成js文件， css打包成一个css文件
      性能优化  http  并发数  一个js 文件
      - 依赖关系
        - 不需要模块化
          被依赖的放在上面，依赖的放在下面
        - 递归依赖关系
    - vite 很快







  # notebook  后端API服务

## egg.js 阿里的开源框架
- koa极简
  - middleware 洋葱模型 函数
  - http listen
  - ctx
- 企业级开发  中大型项目
   mvc
   npm init egg --type=simple
   后台开发的模版
   - app 目录应用开发的主目录
   - 约定大于一切
     - router.js 后端路由

- URL的构成
  params
  http://localhost:7001/user/1
  queryString
  http://localhost:7001/user?id=1

- csrf 攻击
  - 拦截?
    apifox 不是用户
    userAgent 

- post 请求体的格式
  - form-data 有附件 
  - x-www-form-urlencoded key=>value 
  - json 复杂数据结构
- get/post

## 开发流程
- idear 创意
  - aigc 结合
- 需求分析
  - 用户需求
  - 功能点
- 数据库设计
  - 设计表结构
- 前端开发
  - react 
- 后端
  - egg.js
- 测试
- 部署上线

 CREATE TABLE IF NOT EXISTS user ( id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100) NOT NULL UNIQUE, ctime VARCHAR(100) NOT NULL, avatar VARCHAR(100), signature VARCHAR(100), password VARCHAR(100) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

## 代码开发风格的一部分
- AI编程工具的使用
  - MarsCode
  - Cursor / Trae
  - prompt engineering
  - "交互" 前端不可替代
  - 多语言 低代码
  - 不只是项目开发 prompt 生成项目
  - 细节功能 喂伪代码 aigc代码更靠谱
 
- mysql
  - mysql2 数据库驱动
  - egg-sequelize orm框架
    不需要写sql 直接对象开干
    封装了sql
  - service 
    CRUD
  - model
    User

  - egg.js api 服务
    - 路由 
      http 协议
    - controller
      extends Controller
      参数校验、 业务逻辑...
      返回接口需要的json 数据
    - model
      模型定义 table -> model
    - service
      数据库操作 CRUD
    - views
      api 服务，后端不负责界面, react 负责

  - 登录注册
    - 密码加密
      不能存明文, 单项加密
    - jwt json web token
      {
        id: 1,
        username: 'admin',
        exp: 1693650712
      }
      jwt sign token
      后端签发
      - secret 加密 服务器端才能解开
      - 40几位的加密串
      前端localStorage 存
      axios 请求 拦截在请求头中
      authorization: token(localStorage)
      后端verify token -> json user
    
    - egg-jwt jsonwebtoken

  - 登录
    - 前端 Login组件 submit
    - api/login 全部的请求都在这里
      /login { username,password }
    - utils/axios
      - baseURL 自动带上 /api
      - /api 后端提供的接口地址的标志，前后端分离
      - 不带/api,前端路由react-router-dom 管理
    - axios 请求 被vite 配置的代理server 拦截
      proxy 解决了跨域问题
      rewirte /api 干掉了
    - 后端提供接口,后端也可以不只提供接口， 自己做mvc

    - 修改用户slogan
      全栈功能 前端修改表单 
      后端 UPDATE + MVC
      前后端分离
      - 先后端
        - 提供一个修改solgan的接口
          - 路由
            restful api 一切皆资源 设计url的一种规范
          - 中间件 鉴权
            拦在控制器之前 token -> verify user挂在ctx上
          - 控制器
          - service
            - model 已创建
            - orm sequelize
            数据库操作
          - apifox 请求模拟器
          
      - 再前端
        - 路由
        - userinfo 组件
        - api editUserInfo
