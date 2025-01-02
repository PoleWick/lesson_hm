// 实例化时，传递函数，里面装耗时性任务
const p = new Promise((resolve) =>{ // executor 执行器
    console.log('333'); // 同步任务
    setTimeout(()=>{  // 异步任务 event loop
        console.log('222')
        resolve('BMW325') // 执行完后，调用resolve
        // reject()
    },1000)
})
// 异步任务的执行顺序控制的话  用promise
console.log(p.__proto__,p);

p.then((data)=>{
    // 等到executer执行完后，才会执行then里面的回调函数
    console.log('444')
    console.log(p);
    console.log(data);
    
})
.catch(()=>{
    console.log('error')
})
