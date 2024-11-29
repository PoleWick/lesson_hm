// request-promise 负责发送请求的
// import request from '';
// node 早期的 commonjs 模块化
const request = require('request-promise');
// 解析request 拿到的html 字符串
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// 常量 大写 配置项
const HOT_URL = 'https://tophub.today/n/KqndgxeLl9';

// network http 请求  

request(HOT_URL)
    .then(html =>{
// 请求完成了
        // console.log(html);
        // 解析html 得到热榜
        // 加载html字符串 -> tr
        // 内存里模拟浏览器 cheerio的能力
        const $ = cheerio.load(html);
        const hotList = [];
        $('.jc table tr').each((index,element) => {
            // console.log(element);
            // ${node}.find(querySelector)'
            const rank = 
            $(element).find('td:nth-child(1)').text().trim();
            const title = 
            $(element).find('td:nth-child(2)').text().trim();
            // console.log(title);
            const heat = 
            $(element).find('td:nth-child(3)').text().trim();
            const link = 
            $(element).find('td:nth-child(2) a').attr('href').trim();
            hotList.push({
                rank,
                title,
                heat,
                link
            })
        })
        const csvWriter = createCsvWriter({
            path: 'hot_List2.csv',
            header: [
                {id: 'rank', title: 'Rank'},
                {id: 'title', title: 'Title'},
                {id: 'heat', title: 'Heat'},
                {id: 'link', title: 'Link'},
            ]
        })
        csvWriter
        .writeRecords(hotList)
        // console.log(hotList);
        .then(() => (
            console.log('写入完成')
        ))
    })



