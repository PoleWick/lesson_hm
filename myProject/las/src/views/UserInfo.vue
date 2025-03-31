<template>
  <div>
    <!-- 显示用户信息 -->
    <el-avatar :icon="UserFilled" />
    <el-button @click="logout">退出登录</el-button>
    <h1>个人简介</h1>
    <h1>{{ userInfoStore.username }}</h1>
    <h1>{{ userInfoStore. avatar_url }}</h1>
    <h1>{{ userInfoStore.bio }}</h1>
    <h1>{{ userInfoStore.user_id }}</h1>
    <!-- 作品信息 -->
    <div>
      作品信息
    </div>
    
    <!-- 根据需要添加更多内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '../store/userInfoStore'
import { useAuthStore } from '../store/authStore';
import { UserFilled } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const userInfoStore = useUserInfoStore();

const router = useRouter();
const userId = ref('');

const route = useRoute();
userId.value = route.params.userId as string;


const logout = async () => {
  authStore.logout();
  router.push('/wallCard');
}

onMounted(() => {
  const response = userInfoStore.getUserInfo(userId.value);
  console.log(response);
})
</script>