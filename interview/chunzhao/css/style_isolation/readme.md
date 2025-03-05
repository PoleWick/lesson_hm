# 样式隔离
是指在组件开发中，确保每个组件的样式不会影响其他组件，避免全局样式污染。
- vue: scoped
  单文件组件(SFC) scoped
  实现原理是在组件的css上添加一个唯一的属性（data-v-hash值），通过属性选择器实现的
  组件的样式不会影响其他组件
  组件的样式不会影响全局样式
  ```vue
  <div class="example" data-v-f3f3eg9>
  </div>
  .example[data-v-f3f3eg9] {
    color: red;
  }
  ```
  - vue 中可以通过 >>> 来实现嵌套样式隔离
  - vue 中可以通过 /deep/ 来实现嵌套样式隔离
  - vue 中可以通过 ::v-deep 来实现嵌套样式隔离
  - vue 中可以通过 :global 来实现全局样式
  - vue 中可以通过 :deep 来实现嵌套样式隔离
  - vue 中可以通过 :slotted 来实现插槽样式隔离

  - vue 也支持 css modules
    原理：带有随机数的类名
- react: css module
  style.module.css
  - styled component

## 总结
  样式隔离 在单组件文件中实现样式隔离，避免全局样式污染。
  主要是通过 css 的属性选择器和动态生成类名来实现的（加点随机数，也叫HASH串）。
  vue中使用scoped属性，vue 也支持 css modules，还支持 >>> deep 实现嵌套样式隔离。
  react通过引入module.css实现样式隔离，还支持 styled-component 实现嵌套样式隔离,并带来了样式组件的创意。