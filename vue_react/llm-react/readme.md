# react 项目介绍

## 项目亮点
- web 端侧大模型 deepseek-r1 蒸馏模型
  15多亿参数
- tailwindcss 来加速开发样式

## 项目难点
- webworker
  js 单线程   创建一个独立的worker线程
  - 实例化
    new Webworker('worker.js')
  - 消息机制
    postMessage
    onmessage


    navigator.gpu