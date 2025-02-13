const fs = require('fs');
const res = [];
// 多个异步任务同步化的解决方案
// 1. 回调地狱  麻烦  可读性急剧降低
// 包袱可以抖出
// fs.readFile('./a.txt',(err,data)=>{
//     // node 后端的哲学，容错第一
//     if (err) {
//         console.log(err);
//         return;
//     }
//     // 回调函数  最早的异步解决方案
//     // <Buffer 68 65 6c 6c 6f> 二进制格式 Buffer
//     res.push(data.toString());
//     // a.txt -> b.txt
//     fs.readFile('./b.txt',(err,data)=>{
//         if (err) {
//             console.log(err);
//             return;
//         }
//         res.push(data.toString());
//         fs.readFile('./c.txt',(err,data)=>{
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//             res.push(data.toString()); 
//             console.log(res);   
//         })
//     })
// })
// es6 提供promise,优于回调的异步解决方案

// const readFilePromise = (url) => {
//     return new Promise((resolve,reject)=>{
//         fs.readFile(url,(err,data)=>{
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(data.toString());
//         })
//     })
// }

// readFilePromise('./a.txt')
// .then((txt) => {
//     res.push(txt);
//     return readFilePromise('./b.txt');// 链式调用 返回一个promise
// }
// )
// .then((txt2) => {
//     res.push(txt2);
//     return readFilePromise('./c.txt'); 
// })
// .then((txt3) => {
//     res.push(txt3);
//     // console.log(res);
// })
// .catch((err)=>{
//     console.log(err); 
// })
// .finally(()=>{
//     console.log('finally',res);
// })

// es8 async await  基于promise的语法糖

(async ()=>{
    const txt = await readFilePromise('./a.txt');
    res.push(txt);
    const txt2 = await readFilePromise('./b.txt');
    res.push(txt2);
    const txt3 = await readFilePromise('./c.txt');
    res.push(txt3);
    console.log(res);
})()