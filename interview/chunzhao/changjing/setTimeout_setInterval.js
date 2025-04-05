/**
 * 使用setTimeout模拟setInterval
 * @param {Function} callback - 需要重复执行的回调函数
 * @param {number} delay - 执行间隔时间(毫秒)
 * @returns {object} - 返回一个包含clear方法的对象，用于清除定时器
 */
function mySetInterval(callback, delay) {
  // 用于存储当前定时器的ID
  let timerId;
  // 标记是否已停止
  let isStopped = false;

  // 定义递归调用setTimeout的函数
  function interval() {
    if (isStopped) return;
    
    callback();
    
    // 设置下一次调用
    timerId = setTimeout(interval, delay);
  }
  
  // 立即开始第一次调用
  timerId = setTimeout(interval, delay);
  
  // 返回一个包含clear方法的对象
  return {
    clear: function() {
      isStopped = true;
      clearTimeout(timerId);
    }
  };
}

// 使用示例
const timer = mySetInterval(() => {
  console.log('模拟setInterval执行', new Date());
}, 1000);

// 5秒后停止
setTimeout(() => {
  timer.clear();
  console.log('定时器已停止');
}, 5000);
