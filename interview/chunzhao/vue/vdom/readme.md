# 虚拟dom  Virtual DOM

- 虚拟DOM 是**真实DOM**在内存中的轻量级副本
  - 内存中的对象（描述真实DOM）
  - 新|旧 虚拟DOM diff patches 
  - 一次性作用到DOM 更新中

- 一下DOM 片段的虚拟DOM 对象是？
  - 虚拟DOM可以描述真实DOM片段
  - 虚拟DOM = type、props、children([])  +  递归(树)
  - 文本节点直接给文字

- 什么时候生成虚拟DOM？
  template 编译 -> 生成VNode -> render -> 生成真实DOM
  响应式 update 数据状态发生改变 -> 没有虚拟Dom -> 重新生成真实Dom -> 整个替换(重绘、重排 太大了)
  虚拟DOM 生成新的Vnode 内存中 比较新旧的Vnode 差异  -> 生成补丁  -> 应用到真实DOM 上
  针对性的更新 一次性收集所有的修改 patches 打包给真实DOM 一次性更新
  - 组件渲染的时候
  - 组件更新的时候
  - 虚拟DOM 是组件渲染的结果

- v-for key 有什么作用？
  增 删 改 移动
  数据的顺序 ABCD -> DABC
  数据的唯一标识

- Vue 中 h 函数用于创建虚拟 DOM 节点，接收标签名、属性和子节点等参数。

## diff算法
两颗新旧虚拟DOM树
patches 补丁[]
时间复杂度

- 暴力
  - 每个VNode 都比较O(n)
  - 每个VNode 的属性比对O(n)
  - VNode 的children 比对O(n)
  - 时间复杂度 O(n^3)
  如果有1000个节点
  1000 * 1000 * 1000 = 10亿次
- 优化
  - 只做**同层**比较
  - **type** 变了 就不再比较子节点
  - 通过唯一标识key 快速找到节点（移动操作）
  - 时间复杂度 O(n)

  

