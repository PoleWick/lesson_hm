// 本地状态
// counter 数据状态 0 
// const [count , setCount] = usuState(0)
// 中央？状态 -》 redux actions 动作
import { createSlice } from '@reduxjs/toolkit'
// counter 状态切片
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0
  },
// 可以声明一些函数， 纯函数， 用来修改状态 actions  
  reducers: {
    add: (state, action) => {
      state.count += action.payload
    },
    // 上一个状态 reducer 当前状态 -》 上一个状态 -》 
    // reducer函数（生产新状态的函数）
    minus: (state, action) => {
      state.count -= action.payload
    }
  }

})
// reducer 管理状态
// 旧状态-》新状态  reducer函数 纯函数? 只为生产状态, 其他不干
export const { add, minus } = counterSlice.actions
export default counterSlice.reducer