// 基本数据类型间的显式类型转换之Number
// Number 
console.log(Number());// 0
console.log(Number(undefined));// NaN
console.log(Number(null));// 0
console.log(Number(false));// 0
console.log(Number(true));// 1
console.log(Number("123"));// 123
console.log(Number("-123"));// -123
// 十六进制
console.log(Number("0x11"));// 17
console.log(Number(""),Number(" "));// 0 0
// 科学计数法
console.log(Number("123e3"));// 123000
console.log(Number("123e-3"));// 0.123
console.log(Number("100a"));// NaN

