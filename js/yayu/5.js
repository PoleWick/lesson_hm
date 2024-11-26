const cy = {
    name: '陈炎',
    playBasketball: function(){
        console.log('东理科比来了');
    }
}

function Person(name, age){
    this.name = name;
    this.age = age;
    console.log(this.name);
  
}
Person.prototype = cy;
// 原型？ cy
Person('郭',18);
const wu = new Person('武', 19);
wu.playBasketball();
console.log(wu.__proto__ === cy);