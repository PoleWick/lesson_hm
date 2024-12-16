console.log(1 / +0); // 正无穷大 Infinity
console.log(1 / -0); // 负无穷大 -Infinity
console.log(Object.is(5,5));
console.log(Object.is(+0,-0));
// 隐式类型转换
// NaN Not a Number ->
console.log(2 * "a",2 + "a");
console.log(typeof NaN) 
console.log(parseInt("abc"));
console.log(parseInt("123abc"));


