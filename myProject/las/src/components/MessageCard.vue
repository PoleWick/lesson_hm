<template>
  <div class="message-card" :style="{ backgroundColor: message.color || '#fff' }">
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ message.title }}</h3>
        <p v-if="message.subtitle" class="card-subtitle">{{ message.subtitle }}</p>
      </div>
      
      <div class="card-media">
        <img v-if="message.imageUrl" :src="message.imageUrl" alt="帖子图片" @click="openDetail" />
        <video 
          v-else-if="message.videoUrl" 
          :src="message.videoUrl" 
          controls 
          class="video-player"
          @click.stop
          preload="metadata"
        ></video>
      </div>
      
      <div v-if="message.content" class="card-text">
        <p>{{ truncatedContent }}</p>
      </div>
      
      <div class="card-footer">
        <div class="card-date">{{ formatDate(message.createdAt) }}</div>
        <button class="more-btn" @click="openDetail">更多</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// 定义消息类型
interface Message {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  color?: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}

// 定义组件属性
interface Props {
  message: Message;
}

const props = defineProps<Props>();
const router = useRouter();

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

// 截断内容
const truncatedContent = computed(() => {
  if (!props.message.content) return '';
  return props.message.content.length > 50 
    ? props.message.content.substring(0, 50) + '...' 
    : props.message.content;
});

// 打开详情页
const openDetail = () => {
  router.push(`/message/${props.message.id}`);
};
</script>

<style scoped>
.message-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.message-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  margin: 0 0 5px;
  color: #333;
}

.card-subtitle {
  font-size: 14px;
  margin: 0;
  color: #666;
}

.card-media {
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
}

.card-media img,
.video-player {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s;
  cursor: pointer;
}

.card-media img:hover {
  transform: scale(1.05);
}

.video-player {
  cursor: default;
}

.card-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 16px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.card-date {
  font-size: 12px;
  color: #888;
}

.more-btn {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
  transition: color 0.3s;
}

.more-btn:hover {
  color: #40a9ff;
  text-decoration: underline;
}
</style> 