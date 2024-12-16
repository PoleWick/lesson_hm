var a = 1.234;
console.log(typeof a,a.toFixed(2));
var b = new Number(a);
// valueof 是Number的原型方法
console.log(typeof b);
console.log(b.toFixed(2));

