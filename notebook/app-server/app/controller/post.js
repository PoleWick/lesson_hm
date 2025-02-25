'use strict'; // 严格模式

const Controller = require('egg').Controller;
// 继承 基类
class PostController extends Controller {
  async index() {
    // this指向当前的实例 ctx 上下文 = request + response
    const { ctx } = this;
    ctx.body = '文章列表';
  }

  async list() {
    const { ctx } = this;
    try {
      // 调用服务层的 list 方法获取帖子列表
      const list = await ctx.service.post.list();
      // 将帖子列表作为响应返回
      ctx.body = list;
    } catch (error) {
      // 记录错误日志
      ctx.logger.error('Failed to get post list:', error);
      // 设置响应状态码为 500
      ctx.status = 500;
      // 返回错误信息
      ctx.body = { error: 'Failed to get post list' };
    }
  }

  async detail() {
    const { ctx } = this;
    const id = ctx.params.id;
    try {
      // 调用服务层的 find 方法查找对应帖子的详细信息
      const post = await ctx.service.post.find(id);
      if (!post) {
        // 如果帖子不存在，设置响应状态码为 404
        ctx.status = 404;
        // 返回错误信息
        ctx.body = { error: 'Post not found' };
      } else {
        // 如果帖子存在，将其作为响应返回
        ctx.body = post;
      }
    } catch (error) {
      // 记录错误日志
      ctx.logger.error('Failed to get post detail:', error);
      // 设置响应状态码为 500
      ctx.status = 500;
      // 返回错误信息
      ctx.body = { error: 'Failed to get post detail' };
    }
  }
}

module.exports = PostController;