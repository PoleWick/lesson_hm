function objectFactory(fn,...args){
    // const obj = new Object();// 空对象创建
    const obj = {};
    // arguments 类数组，没有shift方法，
    // [].shift.call(arguments); 
    // const Constructor = [].shift.call(arguments);// 取出第一个参数
    // console.log(Constructor);
    obj.__proto__ = fn.prototype;
    const ret = fn.apply(obj,args);
    console.log(ret);
    // console.log(obj);
    // return obj;
    return typeof ret === 'Object' ? ret : obj;
}

function Person(name,age){
    this.name=name;
    this.age=age;
    return {
        name:"dailao",
        age:18,
        tag:'123'
    }
}

Person.prototype.sayHello=function(){
    console.log(this.name+"hello");
}

const dailao = objectFactory(Person,"闵老板",18)
