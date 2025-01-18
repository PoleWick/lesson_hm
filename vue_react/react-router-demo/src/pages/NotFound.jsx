import { useState, useEffect } from 'react';

// react 新特性 hooks 全面内置hooks, vue 学了点
// use 开头 hooks 函数式编程

const NotFound = () => {
  const [count, setCount] = useState(0);
  // 副作用hooks 生命周期挂载后
  useEffect(() => {
    console.log('title 执行了');
    
    document.title = "Not Found"
  })
  
  const add = () => {
    setCount(count + 1)
  }
  // 更新hooks
  useEffect(() => {
    console.log('count 更新了')
  }, [count])
  return (
    <div>
      <h1 onClick={add}>404</h1>
    </div>
  )
}

export default NotFound