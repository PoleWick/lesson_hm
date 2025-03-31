import axios from '@/utils/axios'

// LLM聊天接口
export const chatWithLLM = async (messages, model = 'deepseek-chat', temperature = 0.7) => {
  return await axios.post('/llm', {
    messages,
    model,
    temperature
  })
}