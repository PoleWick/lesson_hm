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
