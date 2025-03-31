<template>
  <div class="profile-page">
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <span class="back-icon">←</span>
      <span>返回首页</span>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载个人资料...</p>
    </div>
    
    <!-- 用户资料 -->
    <div v-else-if="userInfo" class="profile-container">
      <div class="profile-header">
        <div class="avatar-container">
          <img :src="userInfo.avatar || defaultAvatar" alt="用户头像" class="user-avatar" />
          <button class="change-avatar-btn" @click="triggerAvatarUpload">
            <i>📷</i>
          </button>
          <input 
            type="file" 
            ref="avatarInput" 
            style="display: none" 
            accept="image/*"
            @change="handleAvatarChange" 
          />
        </div>
        <div class="user-info">
          <h1 class="username">{{ userInfo.username }}</h1>
          <p class="user-role">{{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}</p>
          <p class="user-email">{{ userInfo.email }}</p>
          <p class="join-date">加入于 {{ formatDate(userInfo.createdAt) }}</p>
        </div>
      </div>
      
      <div class="profile-body">
        <!-- 个人简介 -->
        <div class="profile-section">
          <h2 class="section-title">个人简介</h2>
          <div class="bio-container">
            <textarea
              v-if="isEditingBio"
              v-model="editedBio"
              class="bio-editor"
              placeholder="介绍一下自己吧..."
              maxlength="200"
            ></textarea>
            <p v-else class="user-bio">{{ userInfo.bio || '这个人很懒，还没有填写个人简介' }}</p>
            <div class="bio-actions">
              <button v-if="isEditingBio" class="save-bio-btn" @click="saveBio">保存</button>
              <button v-if="isEditingBio" class="cancel-bio-btn" @click="cancelEditBio">取消</button>
              <button v-else class="edit-bio-btn" @click="startEditBio">编辑</button>
            </div>
          </div>
        </div>
        
        <!-- 我的发布 -->
        <div class="profile-section">
          <h2 class="section-title">我的发布</h2>
          <div v-if="userPosts.length > 0" class="posts-grid">
            <div v-for="post in userPosts" :key="post.id" class="post-item">
              <MessageCard :message="post" />
            </div>
          </div>
          <div v-else class="no-posts">
            <p>您还没有发布过内容</p>
            <button class="create-post-btn" @click="goToHome">去发布</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchUserInfo" class="retry-button">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MessageCard from '../components/MessageCard.vue';
import { userApi, messageApi } from '../apis';

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/150';

// 路由相关
const router = useRouter();

// 状态变量
const userInfo = ref<any>(null);
const userPosts = ref<any[]>([]);
const isLoading = ref(true);
const error = ref('');
const isEditingBio = ref(false);
const editedBio = ref('');
const avatarInput = ref<HTMLInputElement | null>(null);

// 初始化
onMounted(() => {
  fetchUserInfo();
});

// 获取用户信息
const fetchUserInfo = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await userApi.getUserInfo();
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      userInfo.value = apiResponse.data;
      fetchUserPosts();
    } else {
      error.value = apiResponse.message || '加载用户信息失败，请稍后再试';
    }
  } catch (err: any) {
    console.error('获取用户信息失败:', err);
    error.value = err.message || '加载用户信息失败，请稍后再试';
    isLoading.value = false;
  }
};

// 获取用户发布的内容
const fetchUserPosts = async () => {
  try {
    const response = await messageApi.getUserMessages();
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      userPosts.value = apiResponse.data.messages || [];
    } else {
      console.error('获取用户发布内容失败:', apiResponse.message);
    }
  } catch (err) {
    console.error('获取用户发布内容失败:', err);
  } finally {
    isLoading.value = false;
  }
};

// 开始编辑个人简介
const startEditBio = () => {
  editedBio.value = userInfo.value.bio || '';
  isEditingBio.value = true;
};

// 取消编辑个人简介
const cancelEditBio = () => {
  isEditingBio.value = false;
};

// 保存个人简介
const saveBio = async () => {
  try {
    const response = await userApi.updateUserInfo({
      bio: editedBio.value
    });
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      userInfo.value.bio = editedBio.value;
      isEditingBio.value = false;
    } else {
      alert(apiResponse.message || '保存失败，请稍后再试');
    }
  } catch (err: any) {
    console.error('保存个人简介失败:', err);
    alert(err.message || '保存失败，请稍后再试');
  }
};

// 触发头像上传
const triggerAvatarUpload = () => {
  if (avatarInput.value) {
    avatarInput.value.click();
  }
};

// 处理头像变更
const handleAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await userApi.updateAvatar(formData);
      
      // 使用类型断言处理响应
      const apiResponse = response as any;
      
      if (apiResponse.success) {
        userInfo.value.avatar = apiResponse.data.avatar;
      } else {
        alert(apiResponse.message || '头像上传失败，请稍后再试');
      }
    } catch (err: any) {
      console.error('头像上传失败:', err);
      alert(err.message || '头像上传失败，请稍后再试');
    }
  }
};

// 返回上一页
const goBack = () => {
  router.push('/');
};

// 跳转到首页
const goToHome = () => {
  router.push('/');
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};
</script>

<style scoped>
.profile-page {
  max-width: 900px;
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

.profile-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.profile-header {
  display: flex;
  padding: 30px;
  background-color: #f7f9fc;
  border-bottom: 1px solid #eaeaea;
}

.avatar-container {
  position: relative;
  margin-right: 30px;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #1e90ff;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.user-info {
  flex: 1;
}

.username {
  font-size: 24px;
  margin: 0 0 5px;
  color: #333;
}

.user-role {
  display: inline-block;
  padding: 3px 8px;
  background-color: #1e90ff;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 10px;
}

.user-email {
  color: #666;
  margin: 0 0 5px;
}

.join-date {
  color: #999;
  font-size: 14px;
}

.profile-body {
  padding: 30px;
}

.profile-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 16px;
  color: #333;
  position: relative;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #1e90ff;
}

.bio-container {
  position: relative;
}

.user-bio {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  color: #555;
  line-height: 1.6;
  min-height: 80px;
}

.bio-editor {
  width: 100%;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;
}

.bio-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.edit-bio-btn,
.save-bio-btn,
.cancel-bio-btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  border: none;
}

.edit-bio-btn {
  background-color: #f2f2f2;
  color: #555;
}

.save-bio-btn {
  background-color: #1e90ff;
  color: white;
}

.cancel-bio-btn {
  background-color: #f2f2f2;
  color: #555;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.post-item {
  height: 100%;
}

.no-posts {
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
}

.create-post-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 