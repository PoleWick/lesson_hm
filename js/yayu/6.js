function Person(){
}

Person.prototype.name = '孔子'
let person1 = new Person();
let person2 = new Person();
console.log(person1 === person2);
console.log(person1.name,person2.name);