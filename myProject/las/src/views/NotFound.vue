<template>
  <div class="not-found">
    <div class="container">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您要访问的页面不存在或已被移除。</p>
      <div class="actions">
        <button class="home-button" @click="goHome">返回首页</button>
        <button class="back-button" @click="goBack">返回上一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  padding: 20px;
}

.container {
  text-align: center;
  max-width: 500px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #1e90ff;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 32px;
  color: #333;
  margin-bottom: 16px;
}

.error-message {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.home-button,
.back-button {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.home-button {
  background-color: #1e90ff;
  color: white;
}

.home-button:hover {
  background-color: #0c7cd5;
}

.back-button {
  background-color: #e6e6e6;
  color: #333;
}

.back-button:hover {
  background-color: #d9d9d9;
}
</style> 