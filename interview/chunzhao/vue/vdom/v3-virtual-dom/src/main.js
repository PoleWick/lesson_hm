import {
  createApp,
  h
} from 'vue';
// 虚拟DOM是现代前端框架的核心概念之一。
// 它是一个轻量级JavaScript对象，描述了真实DOM的结构和属性。
const vnode = h('div', {id: 'app'},'hello vue3');

createApp({
  render: () => vnode
}).mount('#app');