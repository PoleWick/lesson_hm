<template>
  <div class="message-detail">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <span class="back-icon">←</span>
      <span>返回</span>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchMessage" class="retry-button">重试</button>
    </div>
    
    <!-- 消息内容 -->
    <div v-else-if="message" class="message-container" :style="{ backgroundColor: message.color || '#fff' }">
      <div class="message-header">
        <h1 class="message-title">{{ message.title }}</h1>
        <p v-if="message.subtitle" class="message-subtitle">{{ message.subtitle }}</p>
        <div class="message-meta">
          <span class="message-date">{{ formatDate(message.createdAt) }}</span>
          <span v-if="message.updatedAt && message.updatedAt !== message.createdAt" class="message-updated">
            (更新于 {{ formatDate(message.updatedAt) }})
          </span>
        </div>
      </div>
      
      <div class="message-media">
        <img 
          v-if="message.imageUrl" 
          :src="message.imageUrl" 
          alt="帖子图片" 
          class="message-image" 
          @click="showFullImage = true"
        />
        <video 
          v-else-if="message.videoUrl" 
          :src="message.videoUrl" 
          controls 
          class="message-video"
        ></video>
      </div>
      
      <div v-if="message.content" class="message-content">
        <p>{{ message.content }}</p>
      </div>
      
      <div class="message-author">
        <div class="author-info">
          <img :src="message.author?.avatar || defaultAvatar" alt="用户头像" class="author-avatar" />
          <span class="author-name">{{ message.author?.username || '匿名用户' }}</span>
        </div>
      </div>
    </div>
    
    <!-- 评论区 -->
    <div v-if="message" class="comments-section">
      <h2 class="comments-title">评论 ({{ comments.length }})</h2>
      
      <!-- 评论输入 -->
      <div v-if="isLoggedIn" class="comment-form">
        <textarea 
          v-model="commentText" 
          placeholder="添加评论..." 
          class="comment-input"
        ></textarea>
        <button 
          @click="submitComment" 
          class="comment-submit" 
          :disabled="!commentText.trim() || isSubmitting"
        >
          {{ isSubmitting ? '提交中...' : '提交' }}
        </button>
      </div>
      <div v-else class="login-prompt">
        <p>请 <a @click="goToLogin" class="login-link">登录</a> 后发表评论</p>
      </div>
      
      <!-- 评论列表 -->
      <div v-if="comments.length > 0" class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <div class="comment-author">
              <img :src="comment.user?.avatar || defaultAvatar" alt="评论用户头像" class="comment-avatar" />
              <span class="comment-username">{{ comment.user?.username || '匿名用户' }}</span>
            </div>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-content">
            <p>{{ comment.content }}</p>
          </div>
        </div>
      </div>
      
      <!-- 无评论提示 -->
      <div v-else class="no-comments">
        <p>暂无评论，快来发表第一条评论吧！</p>
      </div>
    </div>
    
    <!-- 图片全屏预览 -->
    <div v-if="showFullImage && message?.imageUrl" class="image-preview-overlay" @click="showFullImage = false">
      <div class="image-preview-container">
        <img :src="message.imageUrl" alt="全屏预览" class="full-image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { messageApi, commentApi } from '../apis';

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/40';

// 路由相关
const router = useRouter();
const route = useRoute();
const messageId = route.params.id as string;

// 状态变量
const message = ref<any>(null);
const comments = ref<any[]>([]);
const isLoading = ref(true);
const error = ref('');
const isLoggedIn = ref(false);
const commentText = ref('');
const isSubmitting = ref(false);
const showFullImage = ref(false);

// 初始化
onMounted(() => {
  checkLoginStatus();
  fetchMessage();
});

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken');
  isLoggedIn.value = !!token;
};

// 获取消息详情
const fetchMessage = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    // 获取消息详情
    const response = await messageApi.getMessageById(messageId);
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      message.value = apiResponse.data;
      // 获取评论列表
      fetchComments();
    } else {
      error.value = apiResponse.message || '加载失败，请稍后再试';
    }
  } catch (err: any) {
    console.error('获取消息详情失败:', err);
    error.value = err.message || '加载失败，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

// 获取评论列表
const fetchComments = async () => {
  try {
    const response = await commentApi.getComments(messageId);
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      comments.value = apiResponse.data.comments || [];
    } else {
      console.error('获取评论失败:', apiResponse.message);
    }
  } catch (err) {
    console.error('获取评论列表失败:', err);
  }
};

// 提交评论
const submitComment = async () => {
  if (!commentText.value.trim() || isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  try {
    const response = await commentApi.addComment(messageId, commentText.value);
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      // 添加新评论到列表
      comments.value.unshift(apiResponse.data);
      commentText.value = '';
    } else {
      alert(apiResponse.message || '评论失败，请稍后再试');
    }
  } catch (err: any) {
    console.error('提交评论失败:', err);
    alert(err.message || '评论失败，请稍后再试');
  } finally {
    isSubmitting.value = false;
  }
};

// 跳转到登录页
const goToLogin = () => {
  router.push({
    path: '/login',
    query: { redirect: route.fullPath }
  });
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};
</script>

<style scoped>
.message-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #e8e8e8;
}

.back-icon {
  margin-right: 8px;
  font-size: 16px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #1e90ff;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message-container {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 30px;
}

.message-header {
  margin-bottom: 20px;
}

.message-title {
  font-size: 24px;
  margin: 0 0 8px;
  color: #333;
}

.message-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0 0 12px;
}

.message-meta {
  font-size: 14px;
  color: #888;
}

.message-updated {
  margin-left: 8px;
}

.message-media {
  margin-bottom: 24px;
}

.message-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
}

.message-video {
  width: 100%;
  max-height: 500px;
  border-radius: 8px;
}

.message-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 24px;
}

.message-author {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.author-name {
  font-size: 14px;
  color: #555;
}

.comments-section {
  margin-top: 40px;
}

.comments-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.comment-form {
  margin-bottom: 24px;
}

.comment-input {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 12px;
  font-family: inherit;
}

.comment-submit {
  padding: 8px 16px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

.comment-submit:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 24px;
}

.login-link {
  color: #1e90ff;
  cursor: pointer;
  text-decoration: underline;
}

.comments-list {
  margin-top: 30px;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding: 16px 0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  display: flex;
  align-items: center;
}

.comment-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 8px;
}

.comment-username {
  font-weight: 500;
  color: #333;
}

.comment-date {
  font-size: 12px;
  color: #999;
}

.comment-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.no-comments {
  text-align: center;
  color: #888;
  margin-top: 30px;
}

.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.image-preview-container {
  max-width: 90%;
  max-height: 90%;
}

.full-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}
</style> 