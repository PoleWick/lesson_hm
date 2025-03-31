<template>
  <el-container style="height: 100vh;">
    <el-main>
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 登录表单 -->
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="loginForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 注册表单 -->
        <el-tab-pane label="注册" name="register">
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="registerForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input type="password" v-model="registerForm.confirmPassword" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleRegister">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import {useAuthStore} from '../store/authStore'
import { useRouter } from 'vue-router';
const router = useRouter();
const authStore = useAuthStore();
// 当前激活的标签页
const activeTab = ref('login');

// 登录表单数据与引用
const loginForm = reactive({
  username: '',
  password: ''
});
const loginFormRef = ref(null);
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
});

// 注册表单数据与引用
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});
const registerFormRef = ref(null);
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ]
});

// 处理登录
const handleLogin = async() => {
  loginFormRef.value.validate((valid) => {
    
    if (valid) {
      // 这里可以添加向后端发送登录数据的逻辑
      const { username, password } = loginForm;
      authStore.login(username, password)
      console.log('准备提交的登录数据:', loginForm);
      ElMessage.success('登录成功');
      router.push(`/wallCard/${authStore.user_id}`);

    } else {
      ElMessage.error('表单验证失败');
      return false;
    }
  });
};

// 处理注册
const handleRegister = () => {
  const { username, password } = registerForm;
  registerFormRef.value.validate((valid) => {
    if (valid) {
      // 这里可以添加向后端发送注册数据的逻辑
      console.log('准备提交的注册数据:', registerForm);
      authStore.register(username,password).then(() => {
        ElMessage.success('注册成功');
      })
      ;
      ElMessage.success('注册成功');
    } else {
      ElMessage.error('表单验证失败');
      return false;
    }
  });
};
</script>

<style scoped>
/* 添加一些样式以美化你的登录和注册界面 */
.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>