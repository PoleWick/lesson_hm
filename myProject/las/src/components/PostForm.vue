<template>
  <div class="post-form-container">
    <div class="post-form-header">
      <h3>留下您的足迹</h3>
      <button class="close-btn" @click="$emit('close')" aria-label="关闭">
        <span>✕ Close</span>
      </button>
    </div>

    <div class="post-form-body">
      <!-- 简单样式选择 -->
      <div class="style-section">
        <div class="style-label">简单样式</div>
        <div class="color-picker">
          <label>Choose Color</label>
          <div 
            class="color-box"
            :style="{ backgroundColor: formData.color }"
            @click="showColorPicker = !showColorPicker"
          ></div>
          <div v-if="showColorPicker" class="color-picker-panel">
            <div 
              v-for="color in colors" 
              :key="color" 
              class="color-option"
              :style="{ backgroundColor: color }"
              @click="selectColor(color)"
            ></div>
          </div>
        </div>
      </div>

      <!-- 预览效果 -->
      <div class="preview-section" :style="{ backgroundColor: formData.color }">
        <div class="preview-content">
          <h4>预览效果</h4>
        </div>
      </div>

      <!-- 上传区域 -->
      <div class="upload-section">
        <p>上传图片，可选</p>
        <div 
          class="drop-area" 
          @dragover.prevent 
          @drop.prevent="onFileDrop"
          @click="triggerFileUpload"
        >
          <div v-if="!formData.file && !formData.filePreview" class="upload-placeholder">
            <div class="upload-icon">
              <i>📁</i>
            </div>
            <p>Upload file</p>
            <p class="upload-hint">Drag or drop your files here or click to upload</p>
          </div>
          <div v-else class="file-preview">
            <img v-if="formData.filePreview" :src="formData.filePreview" alt="Preview" />
            <div class="file-actions">
              <button @click.stop="removeFile" class="remove-file-btn">
                <i>🗑️</i>
              </button>
            </div>
          </div>
        </div>
        <input 
          type="file" 
          ref="fileInput" 
          style="display: none" 
          accept="image/*"
          @change="onFileChange" 
        />
      </div>

      <!-- 表单输入 -->
      <div class="form-inputs">
        <div class="form-group">
          <label class="required">标题</label>
          <input type="text" v-model="formData.title" placeholder="阿狸哥的" />
          <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label>副标题</label>
          <input type="text" v-model="formData.subtitle" placeholder="副标题" />
        </div>

        <div class="form-group">
          <label>文本内容</label>
          <textarea v-model="formData.content" placeholder="网抑云发病笑"></textarea>
        </div>
      </div>

      <!-- 表单底部 -->
      <div class="form-actions">
        <button 
          class="submit-btn" 
          @click="submitForm" 
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '提交中...' : '提交' }}
        </button>
        <button 
          class="update-btn" 
          @click="$emit('close')" 
        >
          更新
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { messageApi } from '../apis';

const emit = defineEmits(['close', 'post-added']);

// 预定义颜色
const colors = [
  '#ff7e67', '#ffa502', '#2ed573', '#1e90ff', '#5352ed', 
  '#ff6b81', '#a4b0be', '#57606f', '#222222', '#ffffff'
];

// 表单数据
const formData = reactive({
  title: '',
  subtitle: '',
  content: '',
  color: '#ff7e67', // 默认颜色
  file: null as File | null,
  filePreview: '' as string
});

// 表单验证错误
const errors = reactive({
  title: '',
  content: ''
});

// 组件状态
const isSubmitting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const showColorPicker = ref(false);

// 选择颜色
const selectColor = (color: string) => {
  formData.color = color;
  showColorPicker.value = false;
};

// 触发文件上传
const triggerFileUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// 文件变更处理
const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    setFile(file);
  }
};

// 文件拖放处理
const onFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files.length) {
    const file = event.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
      setFile(file);
    } else {
      alert('请上传图片文件');
    }
  }
};

// 设置文件并生成预览
const setFile = (file: File) => {
  formData.file = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.filePreview = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// 移除文件
const removeFile = () => {
  formData.file = null;
  formData.filePreview = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 表单验证
const validateForm = () => {
  let isValid = true;
  
  // 重置错误
  errors.title = '';
  errors.content = '';
  
  // 验证标题
  if (!formData.title.trim()) {
    errors.title = '请输入标题';
    isValid = false;
  }
  
  return isValid;
};

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return;
  
  try {
    isSubmitting.value = true;
    
    // 创建FormData对象用于上传文件
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('subtitle', formData.subtitle || '');
    submitData.append('content', formData.content || '');
    submitData.append('color', formData.color);
    
    if (formData.file) {
      submitData.append('file', formData.file);
    }
    
    // 调用API发送数据
    const response = await messageApi.createMessage(submitData);
    
    if (response.success) {
      // 重置表单
      formData.title = '';
      formData.subtitle = '';
      formData.content = '';
      formData.file = null;
      formData.filePreview = '';
      
      // 通知父组件新帖子已添加
      emit('post-added', response.data);
      
      // 关闭表单
      emit('close');
    } else {
      alert(response.message || '发布失败，请稍后再试');
    }
  } catch (error: any) {
    console.error('发布失败:', error);
    alert(error.message || '发布失败，请稍后再试');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.post-form-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.post-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eaeaea;
}

.post-form-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #f56c6c;
}

.close-btn:hover {
  opacity: 0.8;
}

.post-form-body {
  padding: 20px;
}

.style-section {
  margin-bottom: 15px;
}

.style-label {
  font-weight: 500;
  margin-bottom: 10px;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.color-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.color-picker-panel {
  position: absolute;
  top: 30px;
  left: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.color-option {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid #ddd;
}

.color-option:hover {
  transform: scale(1.1);
}

.preview-section {
  height: 100px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.preview-content {
  text-align: center;
}

.upload-section {
  margin-bottom: 20px;
}

.drop-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drop-area:hover {
  border-color: #1e90ff;
  background-color: rgba(30, 144, 255, 0.03);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 10px;
  color: #666;
}

.upload-hint {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.file-preview {
  width: 100%;
  position: relative;
}

.file-preview img {
  max-width: 100%;
  max-height: 120px;
  border-radius: 4px;
}

.file-actions {
  position: absolute;
  top: 5px;
  right: 5px;
}

.remove-file-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.form-inputs {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group label.required::after {
  content: '*';
  color: #f56c6c;
  margin-left: 4px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.submit-btn,
.update-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 14px;
  transition: all 0.3s;
}

.submit-btn {
  background-color: #409eff;
  color: white;
}

.submit-btn:hover {
  background-color: #66b1ff;
}

.submit-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.update-btn {
  background-color: #f2f6fc;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.update-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style> 