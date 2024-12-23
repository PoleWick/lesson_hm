console.log(1 / +0); // 正无穷大 Infinity
console.log(1 / -0); // 负无穷大 -Infinity
console.log(Object.is(5,5));// true
console.log(Object.is(+0,-0));// false
// 隐式类型转换
// NaN Not a Number 
console.log(2 * "a",2 + "a");// NaN NaN2a
console.log(typeof NaN) // number
console.log(parseInt("abc"));// NaN
console.log(parseInt("123abc"));// 123
console.log(NaN === NaN);// NaN不代表确切值
// 不能通过===NaN 去判断， 所以要isNaN
console.log(isNaN(NaN),isNaN(parseInt("abc")));// true false




