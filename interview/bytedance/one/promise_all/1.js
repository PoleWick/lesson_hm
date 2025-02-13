const weather = new Promise((resolve,reject) => {
    setTimeout(() => {
        // resolve({ temp:29, condition:'Sunny with Clouds'});
        reject('error')
    }, 3000);
});

const tweets = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(['I like cake', 'I like pie']);
        // rejects('error')    
    }, 5000);
});

// 简单 并发
// 多个异步任务,不在乎顺序的时候
// js 单线程,怎么并发?
console.time("time")
Promise
  .race([weather, tweets])
//   .all([weather, tweets])
  .then((res) => {
    console.log(res);
});
console.timeEnd("time")