- jsonp 有啥缺点？
  - 不安全
  <script src=""></script> 
  XSS 跨站脚本攻击：
  攻击者在网页上注入客户端脚本（如JavaScript），当其他用户浏览该网页时，这些脚本会在用户的浏览器中执行。
  callback(data)
- GET 方法，不能 post
  script src 不能发送post 等其他请求
- 会阻塞页面渲染, 影响性能
- 不太好处理HTTP 错误， 回调函数只在成功时调用（只能get，无法处理错误，不能返回状态码）
现代应用推荐 CORS 代替 JSONP
- CORS
  跨域资源共享
  Access-Control-Allow-Origin: *
  服务器设置允许跨域的域名
  跨域白名单
  - 允许跨域的域名数组
  - req.headers.origin
  - indexOf 判断是否包含
  - 服务器设置响应头 Access-Control-Allow-Origin || *
  Access-Control-Allow-Methods: GET,POST
    允许请求的方法
  Access-Control-Allow-Headers: X-Requested-With
    允许的请求头
  Access-Control-Allow-Credentials: true
    允许携带cookie
  Access-Control-Max-Age: 1728000
    指定了预检请求的结果可以缓存多久

- 预检请求
  - 简单请求
    - GET, HEAD(用于询问服务器资源的头部信息), POST
  - 复杂请求
    - PATCH, PUT, DELETE
    - 发送两个请求到服务器
      - OPTIONS 用于查询针对服务器上特定资源支持的通信选项,通常用来检查跨域请求是否被允许

- websocket
  不受同源策略限制
  消息机制
  101 switching protocols

- postMessage html5 新特性
  iframe 标签
  一个网页(A)， 嵌入(iframe)支付宝(B)
  不跨域