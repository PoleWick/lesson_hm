// app/controller/llm.js
const Controller = require('egg').Controller;
const axios = require('axios');

class LLMController extends Controller {
  async chat() {
    const { ctx, app } = this;
    const { messages, model, temperature } = ctx.request.body;

    // 参数验证
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      ctx.status = 400;
      ctx.body = { error: '消息格式不正确', code: 400 };
      return;
    }

    try {
      const { baseURL, apiKey, defaultModel, defaultTemperature } = app.config.llm;

      if (!apiKey) {
        ctx.status = 500;
        ctx.body = { error: 'API密钥未配置', code: 500 };
        return;
      }

      // 调用Deepseek API
      const response = await axios.post(
        `${baseURL}/chat/completions`,
        {
          model: model || defaultModel,
          messages,
          temperature: temperature || defaultTemperature
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30秒超时
        }
      );

      // 格式化响应
      ctx.body = {
        code: 200,
        message: response.data.choices[0]?.message?.content || '',
        data: response.data
      };
    } catch (error) {
      console.error('LLM API Error:', error.response?.data || error.message);
      
      // 错误处理
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || error.message;
      
      ctx.status = status;
      ctx.body = {
        code: status,
        error: errorMessage,
        message: '请求失败，请稍后重试'
      };
    }
  }
}

module.exports = LLMController;