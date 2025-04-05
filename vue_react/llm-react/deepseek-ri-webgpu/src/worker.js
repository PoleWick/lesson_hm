/**
 * 检查浏览器是否支持WebGPU
 * 尝试获取GPU适配器来验证WebGPU功能是否可用
 */
async function check() {
    try {
        // 请求GPU适配器，这是WebGPU API的入口点
        const adapter = await navigator.gpu.requestAdapter();
        // 如果无法获取适配器，则表示设备不支持WebGPU
        if (!adapter) {
            throw new Error('WebGPU 不支持');
        }
    } catch (error) {
        // 将错误信息发送回主线程
        self.postMessage({
            status: 'error',
            message: error.toString()
        });
    }
}

const load = async () => {
    // 执行大模型加载
    self.postMessage({
        status: 'loading',
        message: '大模型加载中...'
    });
}

/**
 * WebWorker的消息处理函数
 * 接收来自主线程的消息并根据消息类型执行不同操作
 */
self.onmessage = function (event) {
    //   console.log(event.data);
    // 解构消息数据获取类型和内容
    const { type, data } = event.data;

    // 根据消息类型执行相应操作
    switch (type) {
        case 'check':
            // 执行WebGPU支持检查
            check();
            break;
        case 'load':
            // 执行大模型加载
            load();
            break;
    }
    // 向主线程发送确认消息
    // self.postMessage({
    //     message: 'worker 收到消息'
    // });
}
