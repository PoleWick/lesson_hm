// 贪心策略
// 局部最优解
// 全局最优解
function coinChange(coins, amount) {
//假设coins是升序排列的
  let count = 0;
  let i = coins.length - 1; 
  while (amount > 0) {  
    while(i>0 && coins[i] > amount) {
      i--;
    }
    amount -= coins[i];
    count++;
  }
  return amount === 0 ? count: -1;
}
coinChange([1,5,10,20,50,100], 131);
// 有些时候贪心策略不合适
// coinChange([1, 20, 50], 60);
