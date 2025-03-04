const Koa = require('koa');
const websocket = require('koa-websocket');

const app = websocket(new Koa());
const clients = new Set();

app.use(ctx => {
  ctx.body = `
  <html>
    <body>
      <div id="messages" style="height: 300px; overflow-y: scroll;"></div>
      <input type="text" id="messageInput" />
      <button onclick="sendMessage()">发送</button>
      <script>
        const ws = new WebSocket('ws://localhost:3001');

        ws.onmessage = function(event) {
          // 仅使用一种方式添加消息到页面上
          const messagesDiv = document.getElementById('messages');
          const newMessage = document.createElement('div');
          newMessage.textContent = event.data;
          messagesDiv.appendChild(newMessage);
        };

        function sendMessage() {
          const msg = document.getElementById('messageInput').value.trim();
          console.log(msg);
          if (msg.length > 0) { // 确保输入非空
            ws.send(msg);
            document.getElementById('messageInput').value = ''; // 清空输入框
          }
        }
      </script>
    </body>
  </html>
  `;
});

app.ws.use((ctx) => {
  clients.add(ctx.websocket);
  console.log('Client connected. Total clients:', clients.size);

  ctx.websocket.on('message', (message) => {
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString()); // 广播消息给所有连接且开启状态的客户端
      }
    }
  });

  ctx.websocket.on('close', () => {
    console.log('-------------------',ctx.websocket.socketid);
    
    clients.delete(ctx.websocket);
    console.log('Client disconnected. Total clients:', clients.size);
  });
});

// 确保监听端口与WebSocket客户端连接地址一致
app.listen(3001, () => {
  console.log(`Server running on http://localhost:3001`);
});