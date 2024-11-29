const request = require('request-promise');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// 目标URL
const url = 'https://tophub.today/n/KqndgxeLl9';

// 发送HTTP请求获取网页内容
request(url)
  .then(html => {
    // 使用cheerio加载HTML内容
    const $ = cheerio.load(html);

    // 找到包含热榜数据的表格
    const rows = $('#nKqndgxeLl9 > table > tbody > tr');

    // 提取数据
    const data = [];
    rows.each((index, element) => {

      const rank = $(element).find('td:nth-child(1)').text().trim();
      const title = $(element).find('td:nth-child(2) > a').text().trim();
      const heat = $(element).find('td:nth-child(3)').text().trim();
      const link = 'https://tophub.today' + $(element).find('td:nth-child(2) > a').attr('href');

      data.push({  rank, title, heat, link });
    });
    console.log(data);

    // 创建CSV写入器
    const csvWriter = createCsvWriter({
      path: 'weibo_hot_topics.csv',
      header: [
        { id: 'rank', title: 'Rank' },
        { id: 'title', title: 'Title' },
        { id: 'heat', title: 'Heat' },
        { id: 'link', title: 'Link' }
      ]
    });

    // 写入CSV文件
    csvWriter.writeRecords(data)
      .then(() => console.log('CSV file has been saved.'));
  })
  .catch(err => console.error(err));