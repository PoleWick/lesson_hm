// 贪心算法

function coinChange(coins, amount){
    let count = 0;
    for(let i = coins.length - 1; i >= 0; i--){
        while(amount >= coins[i]){
            amount -= coins[i];
            count++;
        }
    }
    return amount === 0? count: -1;
}