<template>
  <div class="auth-form">
    <!-- 表单标题 -->
    <div class="form-header">
      <h2>{{ mode === 'login' ? '欢迎回来' : '创建账号' }}</h2>
      <p class="form-subtitle">{{ mode === 'login' ? '登录您的账号以继续' : '填写以下信息以创建新账号' }}</p>
    </div>
    
    <!-- 表单内容 -->
    <form @submit.prevent="submitForm">
      <!-- 注册专用字段 -->
      <div v-if="mode === 'register'" class="form-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="formData.username" 
          placeholder="请输入用户名"
        />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
      </div>
      
      <!-- 邮箱字段 -->
      <div class="form-group">
        <label for="email">电子邮箱</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          placeholder="请输入电子邮箱"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      
      <!-- 密码字段 -->
      <div class="form-group">
        <label for="password">密码</label>
        <div class="password-input">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            v-model="formData.password" 
            placeholder="请输入密码"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隐藏' : '显示' }}
          </button>
        </div>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>
      
      <!-- 确认密码字段 (仅注册) -->
      <div v-if="mode === 'register'" class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="formData.confirmPassword" 
          placeholder="请再次输入密码"
        />
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>
      
      <!-- 提交按钮 -->
      <button 
        type="submit" 
        class="submit-button" 
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? (mode === 'login' ? '登录中...' : '注册中...') : (mode === 'login' ? '登录' : '注册') }}
      </button>
      
      <!-- 切换模式 -->
      <div class="form-footer">
        <p v-if="mode === 'login'">
          还没有账号？
          <a href="#" @click.prevent="switchMode('register')">立即注册</a>
        </p>
        <p v-else>
          已有账号？
          <a href="#" @click.prevent="switchMode('login')">立即登录</a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { userApi } from '../apis';

// 定义组件属性
interface Props {
  mode: 'login' | 'register';
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'login'
});

// 定义事件
const emit = defineEmits(['login-success', 'register-success', 'mode-change']);

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 错误信息
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// 组件状态
const isSubmitting = ref(false);
const showPassword = ref(false);

// 切换登录/注册模式
const switchMode = (newMode: 'login' | 'register') => {
  // 重置表单和错误信息
  formData.username = '';
  formData.email = '';
  formData.password = '';
  formData.confirmPassword = '';
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
  
  // 触发模式变更事件
  emit('mode-change', newMode);
};

// 验证表单
const validateForm = () => {
  let isValid = true;
  
  // 重置错误信息
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
  
  // 验证用户名（仅注册模式）
  if (props.mode === 'register' && !formData.username.trim()) {
    errors.username = '请输入用户名';
    isValid = false;
  }
  
  // 验证邮箱
  if (!formData.email.trim()) {
    errors.email = '请输入电子邮箱';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = '请输入有效的电子邮箱';
    isValid = false;
  }
  
  // 验证密码
  if (!formData.password) {
    errors.password = '请输入密码';
    isValid = false;
  } else if (props.mode === 'register' && formData.password.length < 6) {
    errors.password = '密码长度不能少于6个字符';
    isValid = false;
  }
  
  // 验证确认密码（仅注册模式）
  if (props.mode === 'register') {
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }
  }
  
  return isValid;
};

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  
  try {
    if (props.mode === 'login') {
      // 登录请求
      const response = await userApi.login({
        username: formData.email,
        password: formData.password
      });
      
      // 使用类型断言处理响应
      const apiResponse = response as any;
      
      if (apiResponse.success) {
        console.log('登录成功，返回数据:', apiResponse.data);
        // 保存token和用户信息
        localStorage.setItem('accessToken', apiResponse.data.accessToken);
        localStorage.setItem('refreshToken', apiResponse.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(apiResponse.data.user));
        
        // 触发登录成功事件
        emit('login-success', apiResponse.data.user);
      } else {
        // 显示错误信息
        const errorMsg = apiResponse.message || '登录失败，请检查您的凭据';
        errors.email = errorMsg;
      }
    } else {
      // 注册请求
      const response = await userApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // 使用类型断言处理响应
      const apiResponse = response as any;
      
      if (apiResponse.success) {
        // 保存token和用户信息
        localStorage.setItem('accessToken', apiResponse.data.accessToken);
        localStorage.setItem('refreshToken', apiResponse.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(apiResponse.data.user));
        
        // 触发注册成功事件
        emit('register-success', apiResponse.data.user);
      } else {
        // 显示错误信息
        const errorMsg = apiResponse.message || '注册失败，请稍后再试';
        errors.email = errorMsg;
      }
    }
  } catch (error: any) {
    console.error(props.mode === 'login' ? '登录失败:' : '注册失败:', error);
    
    // 显示错误信息
    if (error.response?.data?.message) {
      errors.email = error.response.data.message;
    } else {
      errors.email = props.mode === 'login' ? '登录失败，请稍后再试' : '注册失败，请稍后再试';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// 验证邮箱格式
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
</script>

<style scoped>
.auth-form {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.form-subtitle {
  color: #666;
  font-size: 14px;
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
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #1e90ff;
  outline: none;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 12px;
}

.error-message {
  display: block;
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 5px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #1e90ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 16px;
}

.submit-button:hover {
  background-color: #187bcd;
}

.submit-button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.form-footer a {
  color: #1e90ff;
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style> 