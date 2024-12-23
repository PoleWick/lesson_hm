function Person(name, age) {
    this.name = name;
    this.age = age;
}

function objectFactory() {
    // 创建一个新的空对象
    const obj = new Object();
    // 获取传入的第一个参数，即构造函数
    const Constructor = [].shift.call(arguments);
    // 打印构造函数
    console.log(Constructor);
    // 将新对象的原型指向构造函数的原型
    obj.__proto__ = Constructor.prototype;
    // 调用构造函数，并将this指向新对象，传入剩余的参数
    Constructor.apply(obj, arguments);
    console.log(obj);
    return obj;
}

// 使用objectFactory函数创建一个Person对象实例，并传入参数"awei"和20
let awei = objectFactory(Person, "awei", 20);
console.log(awei.name);

// 为Person构造函数的原型添加一个sayName方法，用于打印对象的name属性
Person.prototype.sayName = function() {
    console.log(this.name);
};
// 调用awei对象的sayName方法，输出"awei"
awei.sayName();
