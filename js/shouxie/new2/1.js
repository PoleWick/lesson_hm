
function objectFactory(fn, ...args) {
    // 创建一个新的空对象
    const obj = {};
    // 将新对象的原型指向构造函数的原型
    obj.__proto__ = fn.prototype;
    // 调用构造函数，并将this指向新对象，传入剩余的参数
    const ret = fn.apply(obj, args);
    // 打印构造函数的返回值
    console.log(ret);
    // 如果构造函数返回的是一个对象，则返回该对象，否则返回新创建的对象
    return typeof ret === 'object' ? ret : obj;
}

function Person(name, age) {
    // 将传入的name参数赋值给当前对象的name属性
    this.name = name;
    // 将传入的age参数赋值给当前对象的age属性
    this.age = age;
    // 返回一个新的对象，覆盖了构造函数默认的返回值
    return {
        name: "dailao",
        age: 18,
        tag: '123'
    };
}

// 为Person构造函数的原型添加一个sayHello方法，用于打印对象的name属性和"hello"
Person.prototype.sayHello = function () {
    console.log(this.name + "hello");
};

// 使用objectFactory函数创建一个Person对象实例，并传入参数"闵老板"和18
const dailao = objectFactory(Person, "闵老板", 18);

