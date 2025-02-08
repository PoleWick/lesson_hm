# 后端http 伺服
# request axios 
from flask import Flask, request, jsonify, send_from_directory
import openai
from dotenv import load_dotenv
# 系统模块
import os

load_dotenv()
# 实例化Flask app 对象
# python 没有new
# 后端驱动的开发中 static 静态文件 =》 前端
# 传统的后端，mvc 没有前后端分离
# 根路径
# 静态文件的路径、名称
# 在static  目录下启动静态服务器 cdn
# / 直接指向 static 
app = Flask(__name__,static_url_path='', static_folder='static')

# 装饰器模式 mvc mvvm view
# 把server_index 装饰成路由的处理函数
# 路由 动态资源 router -> 取数据 -> 渲染 html
# 文件系统 os
@app.route('/')
def server_index():
    return send_from_directory('static', 'index.html')

# deepseek 路由接口
# restful 驱动 网站设计的一个规范 一切皆资源 url + method
@app.route('/chat', methods=['POST'])
# 装饰器模式
def chat():
    # 从请求中获取用户的输入
    user_input = request.json['input']
    # 调用chatbot的生成回复的方法
    response = chatbot.generate_response(user_input)

    try:
        # python 申明变量 不用var 弱类型脚
        # request 请求对象 json 解析请求体
        # python 同步 js 异步
        data = request.json
        model = data.get('model')
        messages = data.get('messages')
        temperature = data.get('temperature', 1.0)

        if not model or not messages:
            return jsonify({'error': ''}), 400
        
        # mvc
        api_key = os.getenv('OPENAI_API_KEY')
        base_url = os.getenv('DEEPSEEK_API_URL')
        # python 更老   json 后面发明

        if not api_key:
            return jsonify({'error': 'OPENAI_API_KEY not found'}), 500
        
        client = openai.OpenAI(api_key=api_key, base_url=base_url)

        # 同步
        # js单线程  node 异步 性能特别好
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            stream=False
        )
        # print(data)
        return jsonify({'message': response.choices[0].message.content})
    except openai.error.OpenAIError as e:
        # 返回响应
        return jsonify({'error': str(e)}),500
    except Exception as e:
        return jsonify({'error': "发生了一个意外错误"}),500
    
        
if __name__ == '__main__':
    app.run(debug=True)
