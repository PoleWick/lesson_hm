# JS 类型转换

- es6 之前，js有多少种类型？
- 简单数据类型、primitive，拷贝式赋值（栈内存）
String Number Boolean Null Undefined 
- 复杂数据类型、引用式赋值（堆内存）
object

- 为何JS 类型会改变？
  Number("1")

- JS 是弱类型语言
- 变量的类型 是可以改变的
- 搞清楚变量的确切类型
  - Primitive 类型 -> 其他类型的转换
  - Boolean
  - Object 类型 -> 其他类型的转换

- Boolean 显式类型转换(构造函数)规则
  - false 的情况  
    - 为空 false
    - 0
    - +0
    - -0
    - null
    - undefined
    - NaN
  - true

- +0 -0
  Object.is()
  1/+0,1/-0 Infinity

- NaN 
  类型仍然是Number，表示一个特殊的数字 Not a Number

- Number()
  0 1 NaN

- String()
  ""