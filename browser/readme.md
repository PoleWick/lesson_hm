# 浏览器底层原理

- 云操作系统
  - web 程序？
    Chrome 足够强的话，可以根据云服务提供的能力，来实现 web 程序。
  - 阿里云  IP 服务
    一台服务器，做虚拟化、容器化（docker）
  - LLM 时代，云 算力资源 共享

- 为什么是Chrome
  - 主流
    - chrome 超越IE 浏览器（Edge）成为NO.1
    - 国内的浏览器 其实就是chrome套壳，但是内核是一样的
  - 内核
    - IE 和 非IE box-sizing 不一样 代码兼容性？  最痛苦的是前端 PC时代
    - 移动时代 ？ 没IE什么事情了  前端终于幸福了
      苹果 开发了webkit 内核
      google 开发了基于webkit 内核的chromium，开源了 chromium 的浏览器项目（360浏览器基于它）
      chrome是chromium的商业版
      - v8引擎 + 渲染引擎
      - webkit 开了分支 升级为了blink内核 

  - 架构
- 为什么要有这么多浏览器进程
  - 进程 是操作系统资源分配的最小单位
  - 线程 是cpu调度的最小单位

  - JS 是单线程的 简单可靠
  - 多线程 更快 
  
  - 并行操作 快？
    - 进程可以启动多个线程
    - 线程可以共享进程之中的数据
    - 进程关闭，回收内存
    - 进程之间相互隔离
  
  - 进程间可以通信吗？
    - 多项 相对比较独立的任务
    下载任务 
    - 进程间的通信 IPC

  - chrome 多进程有哪些？
    - 浏览器主进程
      负责界面显示、用户交互（事件冒泡、捕获机制）、子进程管理（IPC）、存储功能等（cookie、localStorage、indexDB） 安全
    - 渲染进程
      排版Webkit/Blink + v8引擎（JS单线程，异步）在这个进程中运行
      A 页面打开的情况下 B页面也可以打开 A/B 崩溃
      每个tab都是一个渲染进程，运行在**沙箱**中（如GPS功能、摄像头 等 提醒授权）
    - 第三方插件进程
      flash,chrome extensions 单独放在一个进程里是考虑到安全性
    - GPU进程
      用于3D 绘制 transform  translate3d(50%,50%,50%)  GPU加速
      显卡 显存 chrome 习惯使用GPU加速
    - 网络进程
    - 存储进程
    - 多进程架构的好处
      - 避免单个进程崩溃导致整个浏览器崩溃
      - 多进程充分利用多核cpu的优势
      - 避免进程之间的相互影响

- 从输入URL 到页面显示？
  - 浏览器要打开 启动了4个进程（多进程架构） 渲染进程 网络进程 存储进程 浏览器主进程