var a = 1.23;
console.log(typeof a);// number
var b = new Number(a);
console.log(typeof b);// object
console.log(b.toFixed(1));// "1.2"
console.log(a.toFixed(1));// 
console.log(b);
console.log(a);
