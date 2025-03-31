<template>
  <div class="settings-page">
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
    
    <!-- 设置内容 -->
    <div v-else-if="!error" class="settings-container">
      <h1 class="settings-title">账号设置</h1>
      
      <!-- 修改密码 -->
      <div class="settings-section">
        <h2 class="section-title">修改密码</h2>
        <form @submit.prevent="changePassword" class="settings-form">
          <div class="form-group">
            <label for="currentPassword">当前密码</label>
            <input 
              type="password" 
              id="currentPassword" 
              v-model="passwordForm.currentPassword" 
              placeholder="请输入当前密码"
            />
            <span v-if="errors.currentPassword" class="error-message">{{ errors.currentPassword }}</span>
          </div>
          
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="passwordForm.newPassword" 
              placeholder="请输入新密码"
            />
            <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认新密码</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="passwordForm.confirmPassword" 
              placeholder="请再次输入新密码"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="isChangingPassword"
          >
            {{ isChangingPassword ? '处理中...' : '修改密码' }}
          </button>
        </form>
      </div>
      
      <!-- 通知设置 -->
      <div class="settings-section">
        <h2 class="section-title">通知设置</h2>
        <div class="settings-form">
          <div class="form-check">
            <input type="checkbox" id="emailNotifications" v-model="notificationSettings.email" />
            <label for="emailNotifications">接收邮件通知</label>
          </div>
          
          <div class="form-check">
            <input type="checkbox" id="commentNotifications" v-model="notificationSettings.comments" />
            <label for="commentNotifications">有人评论我的内容时通知我</label>
          </div>
          
          <div class="form-check">
            <input type="checkbox" id="likeNotifications" v-model="notificationSettings.likes" />
            <label for="likeNotifications">有人点赞我的内容时通知我</label>
          </div>
          
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="saveNotificationSettings"
            :disabled="isSavingNotifications"
          >
            {{ isSavingNotifications ? '保存中...' : '保存设置' }}
          </button>
        </div>
      </div>
      
      <!-- 删除账号 -->
      <div class="settings-section danger-section">
        <h2 class="section-title">删除账号</h2>
        <div class="settings-form">
          <p class="warning-text">
            删除账号是永久性的，此操作无法撤销。您的所有数据将被删除。
          </p>
          
          <button 
            type="button" 
            class="btn btn-danger" 
            @click="showDeleteModal = true"
          >
            删除我的账号
          </button>
        </div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchUserData" class="retry-button">重试</button>
    </div>
    
    <!-- 删除账号确认弹窗 -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>确认删除账号</h3>
          <button class="close-btn" @click="showDeleteModal = false">&times;</button>
        </div>
        
        <div class="modal-body">
          <p class="modal-warning">
            您确定要删除您的账号吗？此操作无法撤销，您的所有数据将被永久删除。
          </p>
          
          <div class="form-group">
            <label for="deletePassword">请输入您的密码以确认</label>
            <input 
              type="password" 
              id="deletePassword" 
              v-model="deletePassword" 
              placeholder="请输入密码"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            class="btn btn-secondary" 
            @click="showDeleteModal = false"
          >
            取消
          </button>
          <button 
            class="btn btn-danger" 
            @click="deleteAccount"
            :disabled="!deletePassword || isDeletingAccount"
          >
            {{ isDeletingAccount ? '处理中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userApi } from '../apis';

// 路由
const router = useRouter();
const deletePassword = ref('');

// 状态
const isLoading = ref(true);
const error = ref('');
const isChangingPassword = ref(false);
const isSavingNotifications = ref(false);
const isDeletingAccount = ref(false);
const showDeleteModal = ref(false);

// 表单数据
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 表单错误
const errors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 通知设置
const notificationSettings = reactive({
  email: true,
  comments: true,
  likes: true
});

// 初始化
onMounted(() => {
  fetchUserData();
});

// 获取用户数据
const fetchUserData = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await userApi.getUserInfo();
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      // 设置通知偏好（根据后端实际字段调整）
      if (apiResponse.data.notificationPreferences) {
        notificationSettings.email = apiResponse.data.notificationPreferences.email ?? true;
        notificationSettings.comments = apiResponse.data.notificationPreferences.comments ?? true;
        notificationSettings.likes = apiResponse.data.notificationPreferences.likes ?? true;
      }
    } else {
      error.value = apiResponse.message || '获取用户数据失败';
    }
  } catch (err: any) {
    console.error('获取用户数据失败:', err);
    error.value = err.message || '获取用户数据失败，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

// 修改密码
const changePassword = async () => {
  // 重置错误
  errors.currentPassword = '';
  errors.newPassword = '';
  errors.confirmPassword = '';
  
  // 验证
  let isValid = true;
  
  if (!passwordForm.currentPassword) {
    errors.currentPassword = '请输入当前密码';
    isValid = false;
  }
  
  if (!passwordForm.newPassword) {
    errors.newPassword = '请输入新密码';
    isValid = false;
  } else if (passwordForm.newPassword.length < 6) {
    errors.newPassword = '密码长度不能少于6个字符';
    isValid = false;
  }
  
  if (!passwordForm.confirmPassword) {
    errors.confirmPassword = '请确认新密码';
    isValid = false;
  } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }
  
  if (!isValid) return;
  
  isChangingPassword.value = true;
  
  try {
    const response = await userApi.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    });
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      alert('密码修改成功！');
      // 重置表单
      passwordForm.currentPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    } else {
      // 显示错误信息
      if (apiResponse.message.includes('current')) {
        errors.currentPassword = apiResponse.message || '当前密码不正确';
      } else {
        errors.newPassword = apiResponse.message || '密码修改失败';
      }
    }
  } catch (err: any) {
    console.error('修改密码失败:', err);
    errors.currentPassword = err.message || '密码修改失败，请稍后再试';
  } finally {
    isChangingPassword.value = false;
  }
};

// 保存通知设置
const saveNotificationSettings = async () => {
  isSavingNotifications.value = true;
  
  try {
    const response = await userApi.updateUserInfo({
      notificationPreferences: {
        email: notificationSettings.email,
        comments: notificationSettings.comments,
        likes: notificationSettings.likes
      }
    });
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      alert('通知设置已保存！');
    } else {
      alert(apiResponse.message || '保存设置失败，请稍后再试');
    }
  } catch (err: any) {
    console.error('保存通知设置失败:', err);
    alert(err.message || '保存设置失败，请稍后再试');
  } finally {
    isSavingNotifications.value = false;
  }
};

// 删除账号
const deleteAccount = async () => {
  if (!deletePassword.value) {
    return;
  }
  
  isDeletingAccount.value = true;
  
  try {
    const response = await userApi.deleteAccount({
      password: deletePassword.value
    });
    
    // 使用类型断言处理响应
    const apiResponse = response as any;
    
    if (apiResponse.success) {
      // 清除本地存储
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // 跳转到首页
      alert('您的账号已成功删除');
      router.push('/');
    } else {
      alert(apiResponse.message || '账号删除失败，请确认密码是否正确');
    }
  } catch (err: any) {
    console.error('删除账号失败:', err);
    alert(err.message || '账号删除失败，请稍后再试');
  } finally {
    isDeletingAccount.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.settings-page {
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

.settings-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  padding: 30px;
}

.settings-title {
  font-size: 24px;
  margin: 0 0 30px;
  color: #333;
  text-align: center;
}

.settings-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.settings-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
  position: relative;
  padding-bottom: 10px;
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

.settings-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-check {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-check input {
  margin-right: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #1e90ff;
  color: white;
}

.btn-primary:hover {
  background-color: #187bcd;
}

.btn-secondary {
  background-color: #f2f2f2;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e6e6e6;
}

.btn-danger {
  background-color: #ff4d4f;
  color: white;
}

.btn-danger:hover {
  background-color: #ff2d29;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  display: block;
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 5px;
}

.danger-section {
  background-color: #fff8f8;
  padding: 20px;
  border-radius: 8px;
}

.warning-text {
  color: #ff4d4f;
  margin-bottom: 20px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.modal-warning {
  color: #ff4d4f;
  margin-bottom: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 