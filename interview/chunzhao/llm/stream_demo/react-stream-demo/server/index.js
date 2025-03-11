import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa2-cors';

const app = new Koa();
const router = new Router({
    prefix: '/api'
});
const mockData = "React 18 引入了许多底层改进和新特性，虽然大多数现有应用不需要大幅修改就能升级到 React 18，但对于希望充分利用这些新功能的应用来说，了解如何使用并发模式、自动批处理以及新的钩子将是关键。此外，React 团队还强调了渐进式采用的理念，意味着你不必一次性迁移所有特性，可以根据需要逐步采纳。"

// 首先应用CORS中间件
app.use(cors({
    origin: 'http://localhost:5174',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

router.get('/stream', async (ctx) => {
    ctx.set('Content-Type', 'text/event-stream');
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');

    // 定义一个函数 sendChunk，用于将数据块发送给客户端
    const sendChunk = (chunk) => {
        ctx.res.write(`data:${chunk}\n\n`);
    };

    // 将模拟数据 mockData 按字符拆分成一个数组 dataArray
    const dataArray = mockData.split('');

    // 使用 for...of 循环遍历 dataArray 中的每个字符
    for (const char of dataArray) {
        // 调用 sendChunk 函数，将当前字符发送给客户端
        sendChunk(char);
        // 使用 await 和 setTimeout 实现 100 毫秒的延迟
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    ctx.res.end();
});

// 应用路由中间件
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
