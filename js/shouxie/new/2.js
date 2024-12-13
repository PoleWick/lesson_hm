function Person(name,age){
    this.name=name;
    this.age=age;
}

function objectFactory(){
    const obj = new Object();// 空对象创建
    // arguments 类数组，没有shift方法，
    // [].shift.call(arguments); 
    const Constructor = [].shift.call(arguments);// 取出第一个参数
    console.log(Constructor);
    obj.__proto__ = Constructor.prototype;
    Constructor.apply(obj,arguments);
    console.log(obj);
    return obj;
}

let awei = objectFactory(Person,"awei",20)
console.log(awei.name);
awei.sayName();
