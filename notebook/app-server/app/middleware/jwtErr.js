'use strict';
// 中间件函数
// 闭包
module.exports = (secret) =>{
  return async function (ctx, next) {
      const token = ctx.request.header.authorization;
      let decode;
      if (token !='null' && token) {
        try {
            decode = ctx.app.jwt.verify(token, secret);
            ctx.user = decode;
            await next();
        }
        catch (error) {
          ctx.status = 401;
          ctx.body = {
            code: 401,
            msg: 'token 失效或过期，请重新登录'
          }
        }
      }else{
        ctx.status = 401;
        ctx.body = {
          code: 401,  
          msg: 'token不存在'
        }
      }
    } 
    
    
  
}