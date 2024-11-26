// js 造人
// 对象字面量
let chao = {
    name: '小超',
}
let fan = {
    name: '范总',
    age:17
}
// class属于es6 
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    eat() {
        console.log(`${this.name}爱吃饭`);
    }
}

let wei = new Person('阿威', 18);
wei.eat();
let guo = new Person('过帅', 18);

