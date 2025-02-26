'use strict';
const Controller = require('egg').Controller;

class UserController extends Controller {
// java风格

// 注册
  async register(){
    // 解析请求体 username password
    // 校验参数
    // 检索数据库 username 是否存在
    // 不存在 插入数据库
    const { ctx } = this;
    // 解析请求体 username password
    const { username, password } = ctx.request.body;
    // 校验参数
    if(!username || !password){
      ctx.body = {
        code: 400,
        msg: '用户名密码不能为空'
      }
      return;
    }
    const userInfo = await ctx.service.user.getUserByName(username);
    console.log(userInfo,'/////////////////////');
  }
  // username 是否存在

 
// 登录
  async login(){
    const { ctx } = this;
    ctx.body = 'Login success';
  }
}

module.exports = UserController;
