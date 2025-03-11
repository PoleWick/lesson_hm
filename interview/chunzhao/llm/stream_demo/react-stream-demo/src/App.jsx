import React, { useState,useEffect } from "react";
const App = () => {
  const [streamData, setStreamData] = useState('');
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/api/stream', { withCredentials: true });
    // 事件
    eventSource.onmessage = (event) => {
      if (event.data) {
        setStreamData((prevData => prevData + event.data));
      }
    }
    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    }
    return () => {
      eventSource.close();
    }
  },[])
  return (
    <div>
      <h1>大模型流式输出实例</h1>
      <p>{streamData}</p>
    </div>
  )
}

export default App;