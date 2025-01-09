// 全局共享的用户状态
import { defineStore } from 'pinia' 
import { 
  ref,
  reactive
 } from 'vue'
 // hooks 编程
export const useUserStore = defineStore("user", () => {
  const isLogin = ref(false)
  const toLogin = () => {
    isLogin.value = true
  }
  const toLogout = () => {
    isLogin.value = false
  }
  const userInfo = reactive({
    name: "",
    avatar: "",
    message: 0,
    uid:null
  })
  const setUserInfo = (obj) => {
    userInfo.name = "PW"
    userInfo.avatar = "https://p9-passport.byteacctimg.com/img/user-avatar/b75d619d52d2408907ec65ef7abdc671~140x140.awebp"
    userInfo.message = 123
    userInfo.uid = 1669478580758442
  }

  return {
    isLogin,
    toLogin,
    toLogout,
    userInfo,
    setUserInfo
  }
})