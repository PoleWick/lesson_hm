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

  - 并发 -》 并行
    


    