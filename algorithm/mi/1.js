// 求x的n次方

var myPow = function(x, n) {
    let result = 1
    for(let i = 0; i < n; i++){
        result *= x
    }
    return result
};