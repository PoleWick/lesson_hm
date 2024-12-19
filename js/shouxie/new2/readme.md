- 创建一个空对象
- 构造函数执行并绑定this
- 对象的__proto__指向构造函数的prototype
- 如果构造函数的返回值是对象，则返回这个对象，否则返回创建的对象
  (JSON 反复写属性：value,只构造就方便多了，不需要prototype也可以用)


- 得分点
  - es5 arguments.shift.call
  - es6 ...args
  - 构造函数的返回值
    - prototype 不需要，只要构造过程，那么直接返回 是需要的，比JSON方便
  - return null 也能接受，空对象