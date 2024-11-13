# 魔搭社区
> 国内最大AI模型开发平台

## 大模型 LLM Large(参数规模) Language Model
- 输出 -> code -> 输出  // 传统开发方式
- 输入 (prompt) -> LLM(大模型) -> 输出 最酷的开发方式
- 参数规模单位是？LLM 训练出来的参数 上百亿 全球的知识 72B


- 首选大模型
  为了业务，选择合适的大模型
    openai 花费 闭源 
    coze 豆包模型,通义千问，kimi 开源的
- 魔搭社区 
  国内最大的开源大模型社区
  
- 云端AI环境
- 机器学习 nlp
- python 的语法
  -  module 复用、职责分离
   from modelscoe.pipelines import pipeline
   modelscope 魔搭社区提供的包 功能很多  pipelines 管道(nlp 派出管道， 水管)

- damo/nlp_structure_sentiment-classification-chinese-base 情感分类模型
  模型有很多种,  达摩院/  情感分析/  分类 /  支持中文
  医疗模型/ 金融模型/ 法律模型/  

  pipeline(Tasks.text_classification,'damo/nlp_structbert sentiment-classification chinese-base')
  pipeline 打开管道
  选择一项任务 Tasks.text_classification
  选择模型 damo/nlp_structbert sentiment-classification chinese-base

- 模型训练完后就不成长了，没有新的知识，有时会不太准确
  微调模型  喂给模型一些新的数据， 并对数据进行标注

- 前后端为何要学LLM?
  - 端模型的时代到来了
    小尺寸模型越来越强  AI手机  AI汽车  (Robotaxi)  AI具身智能
  - Marscode  提高学习和开发效率
  - 很多工作可以交给大模型
    输入 (prompt) -> LLM(大模型) -> 输出

- LLM 需要算力，来自GPU

