import { defineStore } from 'pinia'
import axios from 'axios'
export const useAuthStore:any = defineStore('auth', {
    
    state: () => ({
        user_id: 0,
        username: '',
        isLogin: false
    }),
    actions: {
        async register(username: string, password: string) {
            try {
                const response = await axios.post('http://localhost:4000/register', { username, password });
                localStorage.setItem('isLogin', 'true');
                return response.data;
            } catch (error) {
                console.error(error);
                this.isLogin = false;
                return false;
            }
        },
        async login(username: string, password: string) {
            try {
                const response = await axios.post('http://localhost:4000/login', { username, password });
                console.log(response.data.data);
                this.user_id = response.data.data.user_id;
                this.username = response.data.data.username;
                this.isLogin = true;
                return true;
            } catch (error) {
                console.error(error);
                this.isLogin = false;
                return false;
            }
        },
        async logout() {
            try {
                this.user_id= 0;
                this.username= '';
                console.log('logout');
                this.isLogin = false;
                // return response.data;
            } catch (error) {
                console.error(error);
                this.isLogin = true;
                return false;
            }
        }
    },
    persist: true, // 持久化存储
})