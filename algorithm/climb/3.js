// 动态规划
const climbStairs = function(n){
    const f = []; // f[i]第i层的最后结果
    f[1] = 1;
    f[2] = 2;
    // 迭代
    for(let i = 3; i <= n; i++){
        f[i] = f[i - 1] + f[i - 2];
    }
    return f[n];
}

console.time("climb");
console.log(climbStairs(50));
console.timeEnd("climb");