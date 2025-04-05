<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <img src="../assets/logo.svg" alt="Logo" class="logo" />
        <h1 class="site-title">Love and Share</h1>
      </div>
      
      <!-- 注册成功提示 -->
      <div v-if="showRegistrationSuccess" class="registration-success">
        <p>注册成功！请使用您的凭据登录。</p>
      </div>

      <div class="form-container">
        <AuthForm 
          :mode="mode" 
          @login-success="onLoginSuccess"
          @register-success="onRegisterSuccess"
          @mode-change="onModeChange"
        />
      </div>
      
      <div class="auth-footer">
        <p>© {{ currentYear }} Love and Share - 智能互动留言墙平台</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthForm from '../components/AuthForm.vue';

// 当前年份
const currentYear = computed(() => new Date().getFullYear());

// 路由相关
const router = useRouter();
const route = useRoute();

// 注册成功提示状态
const showRegistrationSuccess = ref(false);

// 认证模式（登录/注册）
const mode = ref<'login' | 'register'>(route.name === 'Register' ? 'register' : 'login');

// 组件挂载时检查URL参数
onMounted(() => {
  // 设置正确的模式
  mode.value = route.name === 'Register' ? 'register' : 'login';
  
  // 检查是否有注册成功的参数
  if (route.query.registered === 'true') {
    showRegistrationSuccess.value = true;
    
    // 3秒后自动隐藏提示
    setTimeout(() => {
      showRegistrationSuccess.value = false;
    }, 3000);
  }
});

// 修改模式
const onModeChange = (newMode: 'login' | 'register') => {
  mode.value = newMode;
  // 更新URL，保持URL与当前显示模式一致
  router.push({ 
    name: newMode === 'login' ? 'Login' : 'Register',
    query: route.query
  });
};

// 登录成功回调
const onLoginSuccess = (user: any) => {
  // 获取重定向路径（如果有）
  const redirectPath = route.query.redirect as string || '/';
  router.push(redirectPath);
};

// 注册成功回调
const onRegisterSuccess = (user: any) => {
  router.push('/login?registered=true');
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-header {
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

.registration-success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  padding: 10px 16px;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
}

.registration-success p {
  color: #52c41a;
  margin: 0;
  font-size: 14px;
}

.form-container {
  width: 100%;
  margin-bottom: 30px;
}

.auth-footer {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-top: 20px;
}
</style> 