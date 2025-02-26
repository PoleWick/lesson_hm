// couter 模块 
// redux 极其复杂 toolkit 简化了一些概念
import { createSlice } from "@reduxjs/toolkit";

//状态类型的约束 interface 关键字
interface CounterState {
  value: number
}
// initialState 满足 CounterState 接口
const initialState: CounterState = {
  value: 0  
}
// 创建一个 slice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  // 纯函数
  // 接收当前状态和动作
  // 返回新的状态 
  reducers: {
    // 定义一个方法
    increment: (state) => {
      state.value++
    },
    decrement: (state) => {
      state.value--
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload 
    }
  }
})

// 导出方法
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
