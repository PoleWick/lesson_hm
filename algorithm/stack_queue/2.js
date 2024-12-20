function typeOf(obj){
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    // let res = Object.prototype.toString.call(obj).splite(' ')[1]
    // res = res.substring(0, res.length - 1).toLowerCase()
    // return res;
}

console.log(typeOf([]));
