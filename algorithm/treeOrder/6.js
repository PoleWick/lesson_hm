// primitive type  原始数据类型
const key = 'abc123'
let points = 50
let winner = false

const person = {
    name: 'Wes',
    age: 18

}
// 函数是对象，assign是静态的方法 它是属于类的
// const wes = Object.assign({}, person)
// console.log(wes);

// wes.age = 30
// console.log(wes, person);
// 不可写writable
const wes = Object.freeze(person);
person.age = 21;
wes.hometown = '萍乡';
console.log(wes);
