- react 学习路径
  - react 基础语法（B站|文档）
  - hooks 相关
  - 全家桶
  - 状态管理
  - react 源码
  - Antd ...
  - ts

- AI Coding
  - VUE & React 都学
  - 自然语义编程
    tailwindcss 语义 
    antd 组件

  - 设计稿 -> 组件

- http(CDN 更快)引入 前端组件库
  - vue
    Vue

- 挂载点
  将前端工作交给Vue/React，在html内只需要一个**挂载**点 #root

  挂载Vue App 应用实例

- Vue 哲学  vue是让我们专注于业务的现代前端框架逻辑
  - html界面上升到应用已经变的越来越复杂
  - Web应用是数据驱动的界面
  - vue 事件机制  方便 @event="handle"
  - 响应式编程
    - ref(0) 包装简单数据类型成为响应式对象
    - .value = "" 修改value 值改变的同时，界面热更新
    - 不再为API编程，而专注业务逻辑


- App 和传统编程的区别
  - createApp 创建Vue App
  - .mount(#root)  挂载  结合使用 
  - #root 里面就是Vue的内容
  {{count}}
  - {{}}数据占位符
    数据可以改变
    不需要document.querySelector("")
    {{ data }}

    setup(){
      return {
        data
      }
    }