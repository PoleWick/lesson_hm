// hoisting  提升
console.log(a,func);
console.log(b); // 词法环境中的变量、常量，在声明之前不可访问  
// 暂时性死区 TDZ
var a = 1;
function func(){

}
let b = 2;
b++ ;// 词法环境里查找b