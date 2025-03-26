// app/controller/llm.js
const Controller = require('egg').Controller;
const axios = require('axios');

class LLMController extends Controller {
  async chat() {
    const { ctx } = this;
    const { messages } = ctx.request.body;

    try {
      // 调用第三方大语言模型API（示例为OpenAI）
      const response = await axios.post(
        'https://api.deepseek.com',
        {
          model: 'deepseek-chat',
          messages: messages,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // 从环境变量获取密钥
            'Content-Type': 'application/json',
          },
        }
      );

      ctx.body = response.data;
    } catch (error) {
      ctx.status = error.response?.status || 500;
      ctx.body = { error: error.message };
    }
  }
}

module.exports = LLMController;
