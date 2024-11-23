 let a = null;// 存储在栈内存中
 console.log(a);

 let largeObject = {
    data:new Array(1000000).fill('a')
 }
// 堆内存

 largeObject = null;
 // 释放内存 垃圾回收