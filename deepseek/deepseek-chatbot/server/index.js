// commonjs
// node 最简单的后端框架
const koa = require('koa');
// 实例化
const app = new koa();// 也是应用

app.listen(3000, () => {
    console.log('server is running at port 3000');
});
