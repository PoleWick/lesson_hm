# Symbol

- 唯一值
  - 用symbol 函数来声明
  - 给一个label 可选
  - 返回值唯一值
  - 常用于对象字面量  不会，不需要担心  会覆盖
    key 的用法 这也是Symbol 需要的原因
    大厂大型项目， 对象复杂， 难维护 ， 多人协作

  - Object.keys() 对象的键名数组，但是不包括Symbol类型的键名
  - Object.values() 对象的键值数组，但是不包括Symbol类型的键值
  - Object.entries() 对象的键值对数组，但是不包括Symbol类型的键值对

- 可迭代对象
  Object.getOwnPropertyDescriptors(classMates) 获得对象上的属性描述符  
  - 虽然 symbol enumberable 属性为True 但是  不可枚举
    因为Symbol 设计独特， 就是提供唯一值
    getOwnPropertySymbols() 获得对象上的Symbol属性

- ownProperty?