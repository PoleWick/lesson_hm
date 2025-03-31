<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <!-- 标题 -->
    <el-form-item label="标题" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <!-- 副标题 -->
    <el-form-item label="副标题">
      <el-input v-model="form.subtitle"></el-input>
    </el-form-item>

    <!-- 文本内容 -->
    <el-form-item label="文本内容" prop="textContent">
      <el-input type="textarea" v-model="form.textContent"></el-input>
    </el-form-item>

    <!-- 按钮组 -->
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
// 表单数据
const form = reactive({
  title: '',
  subtitle: '',
  textContent: ''
});

// 表单引用
const formRef = ref(null);

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  textContent: [
    { required: true, message: '请输入文本内容', trigger: 'blur' }
  ]
});

// 提交表单
const submitForm = () => {
  const authStore = useAuthStore();
  const user_id = authStore.user_id;
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('准备提交的数据:', form);

      submitFormToBackEnd(form, user_id);
      // 提交成功后，可以在这里做一些处理，比如清空表单、显示成功提示等
      // resetForm();
    } else {
      console.log('表单验证失败');
      return false;
    }
  });
};
const submitFormToBackEnd = async (form, user_id) => {
  try {
    const response = await axios.post('http://localhost:4000/submitAi',{
      form,
      user_id
    });
    console.log('提交成功:', response.data.data.id);
    console.log(response.data);
    // console.log('提交成功:', response.data.data);
  } catch (error) {
    console.error('提交失败:', error);
  }
}
// 重置表单
const resetForm = () => {
  formRef.value.resetFields();
  // 手动清空副标题
  form.subtitle = '';
};
</script>

<style scoped>
/* 可以在这里添加一些样式来美化你的表单 */
</style>