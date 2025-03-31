<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <img src="../assets/logo.svg" alt="Logo" class="logo" />
        <h1 class="site-title">言无止境</h1>
      </div>
      
      <div class="auth-container">
        <AuthForm 
          :mode="mode" 
          @login-success="onLoginSuccess"
          @register-success="onRegisterSuccess"
          @mode-change="onModeChange"
        />
      </div>
      
      <div class="login-footer">
        <p>© {{ currentYear }} 言无止境 - 智能互动留言墙平台</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthForm from '../components/AuthForm.vue';

// 当前年份
const currentYear = computed(() => new Date().getFullYear());

// 路由相关
const router = useRouter();
const route = useRoute();

// 认证模式（登录/注册）
const mode = ref<'login' | 'register'>('login');

// 修改模式
const onModeChange = (newMode: 'login' | 'register') => {
  mode.value = newMode;
};

// 登录成功回调
const onLoginSuccess = (user: any) => {
  // 获取重定向路径（如果有）
  console.log('登录成功，准备跳转', user);
  const redirectPath = route.query.redirect as string || '/';
  console.log('重定向到:', redirectPath);
  router.push(redirectPath);
};

// 注册成功回调
const onRegisterSuccess = (user: any) => {
  router.push('/');
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.site-title {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.auth-container {
  width: 100%;
  margin-bottom: 30px;
}

.login-footer {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-top: 20px;
}
</style> 