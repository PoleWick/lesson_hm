//Promise.all 内置方法
/**
 * 
 * @param {promise[]} promises
 * @return {promise}
 * @description
 *  1.所有的promise都成功才成功
 *  2.有一个失败就失败
 *  3.返回值是一个数组,按照顺序返回
 *  4.如果有一个promise失败,后面的promise不会执行
 * 
 */
Promise.MyAll = (promises) => {
    // promises resolve 后的结果
    let result = [];
        let count = 0; 
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            // 微任务
            // .then 有两个参数 第一个是成功的回调 第二个是失败的回调
            promise
            .then((res) => {
                result[index] = res; // 按照顺序保存结果
                count++; 
                if(count === promises.length) {
                    resolve(result); 
                }
            },reject()) 
        //    .catch((err) => {
        //         reject(err); 
        //    })
        })
    })
}

const weather = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve({ temp:29, condition:'Sunny with Clouds'});
        reject('error')
    }, 3000);
});

const tweets = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(['I like cake', 'I like pie']);
        reject('error')    
    }, 5000);
});

Promise
    .MyAll([weather, tweets])
    .then((res) => {
       console.log(res);
   })
    .catch((err) => {
       console.log(err);
   })

