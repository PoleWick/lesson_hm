FIFO Queue

- typeof
  变量存储的二进制  前三位代表数据类型
  000 代表对象 010 代表函数 100 表示字符 110 表示布尔 1 表示整数 000 表示null（历史遗留问题） 011 表示undefined

- Object.prototype.toString.call()
  
- substring slice
  第二个参数 不一样
  slice 第二个参数 不包含结束位置endIndex 但支持负数
  substring 第二个参数  也不包含结束位置endIndex 且不支持负数
  silce 更好用