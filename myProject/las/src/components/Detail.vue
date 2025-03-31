<template>
  <!-- 主容器 -->
  <div class="min-h-screen bg-gray-50">
    <!-- 响应式布局容器 -->
    <div class="flex flex-col md:flex-row h-full">
      <!-- 主要内容区域 -->
      <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-3xl font-bold mb-4">内容展示区</h1>
          <div class="prose">
            <!-- 这里放置你的主要内容 -->
            <h1>{{ contentInfoStore.title }}</h1>
            <h2>{{ contentInfoStore.subtitle }}</h2>
            <div>
              <img :src="imageUrl" alt="" class="w-100 h-100 flex">
            </div>
            <div>{{ contentInfoStore.text_content }}</div>
            

          </div>
        </div>
      </div>

    </div>
  </div>
  <div>
    <AddComments/>
  </div>
</template>

<script setup>
import AddComments from './ui/AddComments.vue';
import { useAuthStore } from '../store/authStore';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useContentInfoStore } from '../store/contentInfoStore';

// 获取路由参数
import { useRoute } from 'vue-router';
const contentDetail = ref({});
const route = useRoute();
const content_id = route.params.content_id;
const publicPath = 'http://localhost:4000'
const contentInfoStore = useContentInfoStore();
const authStore = useAuthStore();

const imageUrl = ref('');
onMounted(() => {
console.log(content_id);
  contentInfoStore.getContentInfo(content_id);
  imageUrl.value = `${publicPath}${contentInfoStore.image_url}`;
  console.log(imageUrl.value);
})
</script>

<style scoped>
/* 移动端滑动优化 */

</style>