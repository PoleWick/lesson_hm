- 认识几个url
    url的设计模式 restful api
    网站是用来暴露资源的 如何将资源暴露出去 
    - http://localhost:3001/posts/ 列表页的链接
    - http://localhost:3001/posts/:id  id 查询参数 详情页的链接
    - http://localhost:3001/users/:id 用户主页链接

- 数据的查询 Read  
- 访问资源的方式
  - apiFox是啥？  web 请求代理
    Get http://localhost:3000/posts/1
    Patch http://localhost:3000/posts/1
  - 资源 db.json users posts
  - HTTP 协议
    - Methods(动作 GET |PATCH 修改|POST 新增) + url(资源)  请求行
    - Headers(请求头)  Cookie  Content-Type:text/json
    - Body(请求体)  数据

  - json-server
    - http 服务
    - db.json 数据资源向外提供访问服务 CRUD

- 会设计restful api 接口
  - 需求
    - 新增一篇文章
      http://localhost:3001/posts  POST  
      {
        ...
      }

    - 删除 文章2
      http://localhost:3000/posts/2 DELE

- json-server 是一个支持restful api 设计的数据服务器
  

- 全栈防抖
  - 前后端分离  解耦
    - 前端 live-server 5500
      fetch url 
    - 后端 json-server 3001
      url 接口服务 restful
    - API 接口

- filter、map
  - 都是Array.prototype上的方法， 所有数组都有
  - filter 过滤数组，回调函数中的返回值为true， 则该元素保留， 否则过滤掉
  - map 数组映射， 回调函数中的返回值为新的数组  原有数组不能满足需求
  - forEach 遍历数组，不需要返回值

- 防抖
  - 防抖  将要执行的函数交给一个debounce()高阶函数去优化
  - 减少执行的次数 只执行连续输入最后一次
  - 定时器 