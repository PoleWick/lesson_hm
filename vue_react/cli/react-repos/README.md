# react repos 项目列表

- 用户的仓库列表
  - repos 组件

- react 组件
  - .vue , .jsx 组件
  - components/  ->  挂载App.jsx
  - 相比vue的三部分清晰明了 react 函数即组件
    - 首字母大写
    - 返回html， JSX

- vue 和 react 
- 相同点
   - 组件化思想
   - 现代前端编程框架 挂载点
   - 都有工程化配套
   - 数据绑定{{}}{}
   - 响应式，数据驱动，不需要手动操作dom 耗性能

- 不同点 
   - .vue  .jsx
   - template/script/css 三段式 函数即插件
   - vue 好入门，api丰富，react难，但纯粹（js高手比较喜欢）
   - 组合（html + vue + js） 完成一件功能的拆分
   - vue template , react JSX
     - JSX 是react 最漂亮的部分 ， 在函数中 ，最方便的表达UI部分
       本身不可以的， react回去解析JSX html(XML) in js
     - 不能写class， 用className

- 组件类
   - 封装组件 import + export default 功能的拆分
   - （构造）函数组件， return html是必须的
   - 组件可以复用
   - 封装的是UI + 响应式数据
   - 只要写原生js，就可以写组件