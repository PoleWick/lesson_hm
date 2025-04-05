# 性能优化

- 渲染方面有没有考虑性能优化
  - 重绘重排
    - 重绘 
    当元素的样式发生改变时，浏览器重新绘制元素的过程，如改变颜色、背景等属性
    - 重排
    DOM 元素的尺寸、位置发生改变时，浏览器需要重新计算布局，影响到其他元素的位置和大小。

    重排必重绘，重绘不一定重排

- bad work
  - 批量修改DOM 
    切换类名或cssText 代替流程化一句句写



## 资源加载优化
  - 图片懒加载
    getBoundingClientRect()
    intersectionObserver
  - 路由懒加载
    () => import('')
    代码分割 （code spliting） 懒加载的代码独立文件
  - 资源预加载 preload
    预解析