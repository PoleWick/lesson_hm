## 小富 你的私人理财助手

### 项目简介

- 小富是一款基于React+Zarm+Echarts+Egg.js+MySQL的全栈项目，旨在为用户提供便捷的账单管理和分析功能。

- 采用React作为前端框架，搭配Zarm组件库和CustomIcon实现UI和图标，通过react-router-dom管理路由，实现了SPA单页应用的无刷新体验。使用Echarts实现饼状图等数据可视化，同时为了适配不同屏幕尺寸，我采用了基于rem布局方案，结合lib-flexible和postcss-px2rem实现自动化的像素转换，提升开发效率。

- 后端部分使用Egg.js框架搭建RESTful API服务，通过Sequelize ORM对象关系映射操作MySQL数据库，实现了用户认证、账单CRUD等核心功能。用户登录注册采用JWT鉴权，前端通过Axios拦截器统一处理Token传递和接口错误，同时利用Vite的配置好服务器端代理解决跨域问题，后端用Egg.js中间件实现权限控制。数据安全方面，我采取双token策略实现了更安全的用户验证，密码通过bcrypt单向加密存储，避免明文泄露风险。