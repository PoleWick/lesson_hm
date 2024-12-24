var a = 1.23;
console.log(typeof a);// number
var b = new Number(a);
console.log(typeof b);// object
console.log(b.toFixed(1));// "1.2"
// 面向对象极致风格 toFixed(a) 函数式
console.log(a.toFixed(1));
console.log(b);
console.log(a);

(new Number(a)).toFixed();
// 依然还是 number 简单数据类型
