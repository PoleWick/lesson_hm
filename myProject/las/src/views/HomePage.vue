<template>
  <div class="home-container">
    <!-- 头部导航 -->
    <header class="main-header">
      <div class="header-left">
        <div class="logo">
          <img src="../assets/logo.svg" alt="Logo" />
          <h1>言无止境</h1>
        </div>
      </div>
      <div class="header-center">
        <nav class="nav-tabs">
          <button 
            class="nav-tab" 
            :class="{ active: activeTab === 'messages' }"
            @click="activeTab = 'messages'"
          >
            留言墙
          </button>
          <button 
            class="nav-tab" 
            :class="{ active: activeTab === 'videos' }"
            @click="activeTab = 'videos'"
          >
            视频墙
          </button>
        </nav>
      </div>
      <div class="header-right">
        <div v-if="isLoggedIn" class="user-info">
          <img 
            :src="userInfo.avatar || defaultAvatar" 
            alt="User Avatar" 
            class="user-avatar"
            @click="toggleUserMenu"
          />
          <div v-if="showUserMenu" class="user-menu">
            <div class="menu-item" @click="navigateTo('/profile')">个人主页</div>
            <div class="menu-item" @click="navigateTo('/settings')">设置</div>
            <div class="menu-item" @click="logout">退出登录</div>
          </div>
        </div>
        <button v-else class="login-btn" @click="navigateTo('/login')">登录</button>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 消息墙 -->
      <div v-if="activeTab === 'messages'" class="message-wall">
        <div class="messages-grid">
          <div 
            v-for="message in messages" 
            :key="message.id" 
            class="message-item"
          >
            <MessageCard :message="message" />
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div v-if="hasMore" class="load-more">
          <button 
            class="load-more-btn" 
            @click="loadMoreMessages"
            :disabled="isLoading"
          >
            {{ isLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>

        <!-- 无内容提示 -->
        <div v-if="messages.length === 0 && !isLoading" class="no-content">
          <p>暂无内容，快来发布第一条吧！</p>
        </div>
      </div>

      <!-- 视频墙 -->
      <div v-else-if="activeTab === 'videos'" class="video-wall">
        <div class="messages-grid">
          <div 
            v-for="video in videos" 
            :key="video.id" 
            class="message-item"
          >
            <MessageCard :message="video" />
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div v-if="hasMoreVideos" class="load-more">
          <button 
            class="load-more-btn" 
            @click="loadMoreVideos"
            :disabled="isLoadingVideos"
          >
            {{ isLoadingVideos ? '加载中...' : '加载更多' }}
          </button>
        </div>

        <!-- 无内容提示 -->
        <div v-if="videos.length === 0 && !isLoadingVideos" class="no-content">
          <p>暂无视频，快来上传第一个视频吧！</p>
        </div>
      </div>
    </main>

    <!-- 悬浮发布按钮 -->
    <div class="fab-container">
      <button class="fab-button" @click="showPostForm = true">
        <span>+</span>
      </button>
    </div>

    <!-- 发布表单弹窗 -->
    <div v-if="showPostForm" class="modal-overlay" @click.self="showPostForm = false">
      <PostForm 
        @close="showPostForm = false"
        @post-added="onPostAdded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import MessageCard from '../components/MessageCard.vue';
import PostForm from '../components/PostForm.vue';
import { messageApi } from '../apis';

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/40';

// 路由
const router = useRouter();

// 状态
const activeTab = ref('messages');
const isLoggedIn = ref(false);
const showUserMenu = ref(false);
const showPostForm = ref(false);
const userInfo = reactive({
  id: '',
  username: '',
  avatar: ''
});

// 消息数据
const messages = ref<any[]>([]);
const videos = ref<any[]>([]);
const isLoading = ref(false);
const isLoadingVideos = ref(false);
const currentPage = ref(1);
const currentVideoPage = ref(1);
const hasMore = ref(true);
const hasMoreVideos = ref(true);

// 初始化
onMounted(async () => {
  checkLoginStatus();
  await loadMessages();
});

// 检查登录状态
const checkLoginStatus = () => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      isLoggedIn.value = true;
      userInfo.id = user.id;
      userInfo.username = user.username;
      userInfo.avatar = user.avatar;
    } catch (e) {
      console.error('解析用户信息失败', e);
      isLoggedIn.value = false;
    }
  }
};

// 加载消息
const loadMessages = async () => {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    const response = await messageApi.getMessages(currentPage.value);
    
    // 使用类型断言来处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      const newMessages = apiResponse.data.messages || [];
      messages.value = [...messages.value, ...newMessages];
      
      // 更新分页信息
      hasMore.value = currentPage.value < (apiResponse.data.totalPages || 1);
      currentPage.value++;
    } else {
      console.error('加载消息失败:', apiResponse.message);
    }
  } catch (error) {
    console.error('加载消息错误:', error);
  } finally {
    isLoading.value = false;
  }
};

// 加载更多消息
const loadMoreMessages = () => {
  loadMessages();
};

// 加载视频
const loadVideos = async () => {
  if (isLoadingVideos.value) return;
  
  try {
    isLoadingVideos.value = true;
    // 使用仅需要的参数
    const response = await messageApi.getMessages(currentVideoPage.value, 10);
    
    // 使用类型断言来处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      // 在这里可以过滤出视频类型的消息
      const allMessages = apiResponse.data.messages || [];
      const videoMessages = allMessages.filter((msg: any) => msg.videoUrl);
      videos.value = [...videos.value, ...videoMessages];
      
      // 更新分页信息
      hasMoreVideos.value = currentVideoPage.value < (apiResponse.data.totalPages || 1);
      currentVideoPage.value++;
    } else {
      console.error('加载视频失败:', apiResponse.message);
    }
  } catch (error) {
    console.error('加载视频错误:', error);
  } finally {
    isLoadingVideos.value = false;
  }
};

// 加载更多视频
const loadMoreVideos = () => {
  loadVideos();
};

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

// 导航到指定页面
const navigateTo = (path: string) => {
  router.push(path);
  showUserMenu.value = false;
};

// 退出登录
const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  showUserMenu.value = false;
  router.push('/login');
};

// 监听标签切换
watch(activeTab, (newValue) => {
  if (newValue === 'videos' && videos.value.length === 0) {
    loadVideos();
  }
});

// 新帖子添加后的处理
const onPostAdded = (newPost: any) => {
  // 如果是视频类型，添加到视频列表
  if (newPost.videoUrl) {
    videos.value.unshift(newPost);
  } else {
    // 否则添加到消息列表
    messages.value.unshift(newPost);
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 头部样式 */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left,
.header-right {
  flex: 1;
}

.header-right {
  display: flex;
  justify-content: flex-end;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 36px;
  margin-right: 10px;
}

.logo h1 {
  font-size: 20px;
  margin: 0;
  color: #333;
}

.nav-tabs {
  display: flex;
  gap: 10px;
}

.nav-tab {
  padding: 8px 16px;
  border-radius: 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s;
  color: #666;
}

.nav-tab.active {
  background-color: #f0f0f0;
  color: #333;
  font-weight: 500;
}

.user-info {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  border: 2px solid #f0f0f0;
}

.user-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 140px;
  z-index: 100;
}

.menu-item {
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.login-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #1e90ff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.login-btn:hover {
  background-color: #1a80e5;
}

/* 内容区样式 */
.main-content {
  flex: 1;
  padding: 30px;
  background-color: #f9f9f9;
}

.messages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.message-item {
  display: flex;
  height: 100%;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 40px;
}

.load-more-btn {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #555;
  font-size: 14px;
  transition: all 0.3s;
}

.load-more-btn:hover {
  background-color: #eaeaea;
}

.load-more-btn:disabled {
  background-color: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
}

.no-content {
  text-align: center;
  padding: 40px 0;
  color: #888;
}

/* 悬浮按钮样式 */
.fab-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 50;
}

.fab-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1e90ff;
  color: white;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(30, 144, 255, 0.3);
  transition: all 0.3s;
}

.fab-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(30, 144, 255, 0.4);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 100;
}
</style> 