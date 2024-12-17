// 贪心算法

function coinChange(coins, amount){
    let count = 0;
    for(let i = 0; i < coins.length; i++){
        while(amount >= coins[i]){
            amount -= coins[i];
            count++;
        }
    }
    return amount === 0? count: -1;
}