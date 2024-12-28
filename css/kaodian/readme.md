## 层叠上下文

# 页面规则
- 文档流
  body 开始从上到下，从左到右

- 布局 Layout

- 盒模型 盒子（本身）大小
  box-sizing: border+padding+content
  标准盒模型 box-sizing: content-box 宽高只设置内容
  怪异盒模型 box-sizing: border-box  border以内都算

- 认标签，但也可转变 display

- 块级元素 block
- 行内元素 inline  不能用做盒子，不能设置宽高，宽高由其内容决定
  块级元素为何默认宽度是100%？
  html 是第一个BFC 元素, body 参与html的BFC
    页面显示由html负责  页面的布局 块级元素从上到下，行内元素从左到右

- display

- BFC Block Formatting Context 块级格式化上下文
  - html 是根元素，也是最顶级的BFC
  - context 块级元素从上到下，行内元素从左到右

- 格式上下文？ 上下文（看的是我跟谁混）
  - 为何弹性布局 打破了html BFC 的规则?
    - BFC 不是某个元素的特例，  弹性布局， 创立了一个新的BFC 
    - BFC 不受外界影响，全新的独立的渲染区域 FFC Flex Formatting Context 弹性格式化上下文
      flex-direction: row|column
  - GFC 网格布局 Grid Formatting Context

# BFC
  - 独立渲染区域,不受外界影响
  - html 是最顶级的BFC
  - block level box 垂直方向, 一个接一个的放置，且宽度100%
  - 盒子垂直方向的距离由margin 决定，同一个BFC 的相邻盒子的margin 会发生重叠，大的说了算
  - 每个元素的margin 左边，与包含块border的左边相接触，即使存在浮动也一样
  - BFC 的区域不会与float box 重叠
  - 计算BFC的高度时，浮动元素也参与计算
  

- 触发新BFC
  - overflow: hidden|auto...  overflow属性不为visible  水杯盛开水
  
