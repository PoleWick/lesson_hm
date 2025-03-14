# http 版本

- 0.9
  GET请求 不包含头信息
- 1.0
  增加了HEAD(cookies、autherization)、POST等方法
  增加了状态码 statusCode
  text/plain image/jpg  text/css
- 1.1
  tcp/ip 每次都链接 断开链接 浪费资源
  增加了持久连接（Connection: keep-alive）
  增加了管道化（Pipelining）:允许客户端在同一个TCP连接上发送多个http请求，而不需要等待前一个请求的响应。（设计旨在减少建立连接的开销）
    1.请求HTML 文档 GET index.html
    2.请求CSS 文档 GET style.css
    3.请求图片
    4.请求图片

    由于共享一个TCP 连接 队头阻塞问题
  http 并发数提升了
- 2.0
  引入了多路复用（Multiplexing）：允许在同一个TCP连接上发送多个http请求和响应，相互之间不受影响。
  二进制分帧（Binary Framing）：将http消息分割成更小的帧，提高传输效率和安全性，支持多路复用。
  服务器推送（Server Push）：服务器可以主动向客户端发送资源，而无需客户端明确请求。
- 3.0
  引入了加密传输（Encrypted Transport）

性能优化包括升级HTTP协议

