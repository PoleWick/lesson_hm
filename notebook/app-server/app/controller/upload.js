const Controller = require('egg').Controller;

class UploadController extends Controller {
  async index() {
    const { ctx ,app } = this;
    // 用户 身份验证 jwt
    try {
        let usr_id;
        const token = ctx.request.header.authorization;
        const decode = app.jwt.verify(token, app.config.jwt.secret);
        if (!decode) return
        console.log(decode);
        usr_id = decode.id;
        ctx.body = {
            code: 200,
            msg: '上传成功',
            data: decode
        }
    }catch (error) {
        ctx.status = 401;
        ctx.body = {
            msg: '用户未登录'
        }
    }    
  }
}

module.exports = UploadController;