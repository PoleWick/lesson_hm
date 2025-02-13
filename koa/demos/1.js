// js两种模块化方案 commonjs 和 es6 module
// mvc
const Koa = require('koa');
const app = new Koa();
// node 内置 文件模块
const fs  = require('fs');

//中间件

const main = ctx => {
  // index.html 返回给用户
  // fs 读取文件
  // 读操作
  // 流 水龙头
  // 返回给用户
  ctx.response.type = 'html'; // 响应头
  // 创建一个读取流？ 文件流  水龙头一样
  ctx.response.body = fs.createReadStream('./index.html');
  // ctx.body = 'Hello World';
  // ctx.response.body = 'Hello World'; 
}

//中间件  req  middlewares  res
app.use(main);

app.listen(3000);