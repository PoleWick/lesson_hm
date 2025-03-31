// import { defineStore } from 'pinia'
// import axios from 'axios'

// export const useUserInfoStore = defineStore('auth', {
//     state: () => ({
//       user_id: null,
//       avatar_url: null,
//       username: null,
//       bio: null,
//     }),
//     actions: {
//       text(){
//         console.log('text')
//       }
//   },
    
//     persist: true, // 持久化存储
// })

import { defineStore } from 'pinia';
import axios from 'axios';

// 注意更改store名字，避免冲突
export const useUserInfoStore :any= defineStore('userInfo', {
  state: () => ({
    user_id: null,
    avatar_url: null,
    username: null,
    bio: null,
  }),
  actions: {
    async getUserInfo(userId:string) {

      try {
        const response = await axios.get(`http://localhost:4000/user/${userId}`)
        this.user_id = response.data.user_id
        this.avatar_url = response.data.avatar_url
        this.username = response.data.username
        this.bio = response.data.bio
        return response.data
      } catch (error) {
        console.error(error);
      }
    },
  },
  persist: true, // 持久化存储
});