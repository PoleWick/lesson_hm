<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <img src="../assets/logo.svg" alt="Logo" class="logo" />
        <h1 class="site-title">言无止境</h1>
      </div>
      
      <div class="auth-container">
        <AuthForm 
          mode="register" 
          @register-success="onRegisterSuccess"
          @mode-change="onModeChange"
        />
      </div>
      
      <div class="register-footer">
        <p>© {{ currentYear }} 言无止境 - 智能互动留言墙平台</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AuthForm from '../components/AuthForm.vue';

// 当前年份
const currentYear = computed(() => new Date().getFullYear());

// 路由相关
const router = useRouter();

// 注册成功回调
const onRegisterSuccess = (user: any) => {
  router.push('/');
};

// 修改模式时的处理
const onModeChange = (mode: 'login' | 'register') => {
  if (mode === 'login') {
    router.push('/login');
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-header {
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

.register-footer {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-top: 20px;
}
</style> 