// es6 set 不重复的容器
const mySet = new Set();
mySet.add(1);
mySet.add("hello");
mySet.add(true);
mySet.add(1);
console.log(mySet);


for(const item of mySet) {
    console.log(item);
}
console.log(Array.from(mySet));