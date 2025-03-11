'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(username) {
    const { ctx } = this
    try {
      const result = await ctx.model.User.findOne({
        where: {
          username
        }
      })
      return result
    } catch(err) {
      console.log(err)
      return null
    }
  }

  async register(user) {
    const { ctx } = this
    try {
      // orm 
      // sequelize
      const result = await ctx.model.User.create(user)
      return result
    } catch(err) {
      console.log(err);
      return null;
    }
  }

  async editUserInfo(username, signature) {
    const { ctx } = this
    try {
      const user = await this.getUserByName(username);
      if (!user) {
        return {
          code: 404,
          msg: '用户不存在',
          data: null
        };
      }
      const result = await user.update({
        signature: signature
      });
      return {
        code: 200,
        msg: '修改成功',
        data: result
      };
    } catch(err) {
      console.log(err);
      return {
        code: 500,
        msg: '修改失败',
        data: null
      };
    }
  }
}

module.exports = UserService;