<template>
  <div class="mb-10 flex min-h-5 w-full flex-row items-center justify-center z-20 cursor-pointer" @click="ToUserInfo">
    <AnimatedTooltip :items="people" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AnimatedTooltip from './ui/AnimatedTooltip.vue';
import { useAuthStore } from '../store/authStore';
const router = useRouter();
const authStore = useAuthStore();
const userId = authStore.user_id;
const ToUserInfo = () => {
  router.push(`/userInfo/${userId}`);
}
const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
];
</script>