// common js  node 早期模块化方案
// js 更早期没有模块化方案

// es6 模块化方案
// import {a,b} from './a.js'
// 函数、类(js没有) ， js业务简单 页面交互等
// 轮播图   动画  拖拽  瀑布流 js就干这些事
// 越来越复杂，文件分离， 引入第三方库  需要模块化方案   
const sqlite3 = require('sqlite3');
// 后端逻辑和数据库逻辑是分开的
// db 数据库连接对象 数据库操作句柄
// 路径
// I/O 操作
const db = new sqlite3.Database('./mydatabase.db',
    async (err) => {
    if (err) {
        console.log('数据库连接失败', err);
        return;
    }
    console.log('数据库连接成功');
     //err 是否出错，容错很关键
    //node js 快 ms 级别
    //数据库  别的服务器/硬盘上  响应慢  秒级别
    //await
    //风筝 数据库操作句柄
    await db.run(`
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY ,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        salary REAL NOT NULL
    )`)

   
   
});