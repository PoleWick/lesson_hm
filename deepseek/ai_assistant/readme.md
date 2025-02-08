# AI Assistant 全栈项目
- 大前端全栈
- 后端驱动全栈为主
  - 设计模式
    大前端 前端 mvvm   model(数据状态 useState,ref/reactive， api/axios 接口, pinia) view

    model 模型层 = 数据定义 + 数据处理 + 数据存储 + 数据管理 + 数据请求
    view 视图层 = component 组件  views components 
    vm 视图模型层  数据绑定{}  {{}}  数据驱动界面 （v-if/v-show/v-for）...  script 事件监听 @Change onChange props

    产品设计线框图 idear 亮点

    后端 mvc  数据库 mysql table  简历模型
    model   数据库是独立于后端的  数据模型文件 schema orm
    view 视图层 = 前端页面 index.html about.html
    controller 控制器层 

  - 并发数
  - 基础设备
  - DDos 肉鸡攻击 qps

## 后端全栈AI 项目
- python flask 框架 node koa
  app.py 单点入口
- 纯js
- deepseek 在线api

## 项目准备
- 安装python
  3.10.6
- 配置虚拟环境
  本地项目的项目依赖  不受全局影响， 不影响全局
  项目下有了项目依赖包
  source ai_assistant/bin/activate

  pip install openai Flask python-dotenv -i https://mirrors.aliyun.com/pypi/simple/

  openai  已经成为了aigc LLM 的事实标准
  /completion /chat
  base_url deepseek 
  Flask koa 后端框架

  - 没有前后端分离 mvc 开发模式
    - 前端 static 目录下
    - 路由 / 显示index.html
    