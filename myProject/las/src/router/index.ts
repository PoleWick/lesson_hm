import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
// : 声明一个类型 RouteRecordRaw 一个route 类型 RouteRecordRaw[] route数组
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: { title: '言无止境 - 首页' }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage.vue'),
        meta: { title: '言无止境 - 登录' }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterPage.vue'),
        meta: { title: '言无止境 - 注册' }
    },
    {
        path: '/message/:id',
        name: 'MessageDetail',
        component: () => import('../views/MessageDetail.vue'),
        meta: { title: '言无止境 - 详情' }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage.vue'),
        meta: { 
            title: '言无止境 - 个人主页',
            requiresAuth: true
        }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import('../views/SettingsPage.vue'),
        meta: { 
            title: '言无止境 - 设置',
            requiresAuth: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue'),
        meta: { title: '页面未找到' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title as string || '言无止境'
    
    // 检查是否需要登录权限
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
            return
        }
    }
    
    next()
})

export default router