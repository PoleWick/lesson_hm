- promise.all
  - fs.readfile node
    java/python 阻塞
    node 异步无阻塞 no blocking 性能好, 节省70%性能开销 服务器性能提升 少用很多服务器
  - I/O 异步  不好控制执行顺序
    - callback 回调
    按顺序读取
    I/O 内存和硬盘读取速度相差很大
  - es5 callback,es5 promise, es8 async/await
    异步变同步问题
    js异步解决方案在进化
    callback 回调地狱被诟病 早期没那么复杂的业务
    promise链式调用上场了 then return promise
    async/await 基于promise  await + promise 同步写法一样了
  - promise
  - return promise thenable
  - 封装一个promise 函数
  - 表达的简洁性
- 异步任务 并发怎么办？


- 多个异步任务, all
  - **promise实例**放到一个数组里面
  - **promise.all()**方法接受一个数组作为参数，数组中的每个元素都是一个Promise实例。
  - 所有的promise都执行完了，才会返回结果
  - 如果有一个promise 失败了，就会返回失败的结果

  - race 
    返回第一个被解决的任务，不管是成功还是失败
    - 谁先执行完，就返回谁的结果

  - allSettled
    返回所有的结果，不管是成功还是失败
    - 谁先执行完，就返回谁的结果
    - 无论成功还是失败，都会返回结果

  - any
    返回第一个被解决的任务，不管是成功还是失败
    - 谁先执行完，就返回谁的结果
    - 无论成功还是失败，都会返回结果

  - 手写题的套路
    - 通过注释的方式，表达自己的思路
    
  - react 性能优化
    - useMemo
    - useCallback

    - interface ts 的核心概念
      **自定义类型**的一个方式
      inteface和type的区别
      - 子组件 props 怎么更安全？
      - 父组件必须提供Props 约定的参数
      - type可以定义基本类型和联合类型
      - interface只能定义对象类型
      - type可以定义交叉类型
    - 组件响应式
      - 改变后 组件函数是会重新运行的
      - 子组件 重新运行，就有点冤
        - 开销大
        - 性能问题
        - 没有必要

    - React.memo 缓存组件
      当子组件props 之外的改变时。子组件无关， 不更新
    - react不分props
