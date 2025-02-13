const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();

const main = ctx => {
  if ( ctx.required.path !== '/') { // 不是首页
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>'; 
  }else{
    ctx.response.type = 'text';
    ctx.response.body = '<h1>Hellow World</h1>';
  }
}

const about = ctx => {
  ctx.response.type = 'text';
  ctx.response.body = '<a href="/">Index Page</a>';
}


app.use(main);//启用是中间件
app.use(route.get('/',main))
app.use(route.get('/about',about))
app.listen(3000);