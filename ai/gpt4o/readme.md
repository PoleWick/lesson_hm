# 面向 Openai 接口编程

- 多模态
 - 单模态
    Chatgpt 文本
 - 图片、视频、音频

 - npm init -y 后端
   npm i openai   openai sdk

   - npm config set registry https://registry.npmmirror.com  国内镜像
     设置了npm的镜像源， npm 国外的包下载速度慢， 阿里国内做了npm的镜像，国内的源下载速度快 提速



   - 每个文件夹安装openai 占用时间占用空间
     npm i openai -g 全局安装
     npm i -g pnpm  
     包装到哪里去了？  它可以在命令行直接调用  环境变量？污染全局

   - 既不会重复安装也不会污染全局， 用符号链接指向之前的安装
     使用pnpm 速度快了 ，空间省了

   - main.mjs  主入口， 单点入口的职责(一个程序只有一个入口) 
     mjs es6 module 模块规范语法 import from

   - 调试能力
    console.log(result)  深 查看它的json结构

   - 理解参数
     gpt4o 多模态读图能力 
       - 文本指令
       - 图片地址

   - try catch 异常处理
     容错

   - key 不能提交到github
     资产的安全风险

