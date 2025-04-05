# 场景题
有一个页面，有8个元素，做了flex布局，请计算性能指标的渲染总时间和第一个元素的渲染完时间

- 页面显示流程：
  DOM + CSSOM = Render Tree + Layout + 图层（z-index transform 只触发重绘）

  script 尾部执行
  事件监听（？）

  

主线程同步代码
      ↓
   宏任务 ←─────────────┐
      ↓                │
   微任务队列（清空）     │
      ↓                │
   是否需要渲染？─否─→ 宏任务 │
      ↓ 是             │
   requestAnimationFrame │
      ↓                │
   渲染流程（样式、布局、绘制）│
      ↓                │
   下一轮事件循环 ────────┘

## 监控和分析
   - performance
     减少首屏JS/CSS 体积
   - LightHouse

- 用setTimeout模拟setInterval
- promise 实现并发控制
- promise红绿灯
- 手写promise.allSettled
- 手写promise
- http 2.0多路复用 是不是越多越好？会有上限吗？
- cursor 和 windurf 用的多吗？ 占比多少？ trae用过吗？