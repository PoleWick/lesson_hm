# Love and Share 分享热爱
## 项目概述
“言无止境”是一款集成了多种先进技术和功能的智能互动留言墙平台的全栈项目。它不仅提供传统的留言发布和互动功能，还深度融合了人工智能、实时通信和多媒体处理技术，为用户提供了一个高效、智能、安全的互动空间。无论是个人用户还是企业用户，都能在这个平台上找到满足其需求的功能。

## 技术栈
Vue3,  Axios,  Nodejs,  Express,  Mysql,  Deepseek,  doubao-seaweed,  阿里云OCR,  Webscoket。
## 技术特点
- 使用双token认证，增强安全性以及用户体验。
- 视频上传支持大文件分片上传，断点上传，秒传，以及利用抖音旗下的即梦Ai智能生成视频,并使用阿里云OSS进行储存，
- 视频页进行了懒加载，预处理以及CSS层面相关性能优化。
- 视频利用阿里云视频OCR对上传视频进行分析，并使用deepseek进行内容处理生成摘要。以及使用阿里云GenerateVideoCover智能生成视频封面,
- 评论界面支持多级嵌套评论，点赞，回复以及利用deepseek进行流式回复功能。
- 利用WebSocket实现私聊功能。
- 利用Element Plus,tailwincss,inspira UI打造具有响应式和美观的UI界面


