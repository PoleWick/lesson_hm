<template>
  <div class="container">
    <el-button @click="visible = true" :icon="Edit" circle type="primary" size="large" id="addButton" ></el-button>

    <el-drawer v-model="visible" :show-close="false">
      <template #header="{ close, titleId, titleClass }">


        <h1 :id="titleId" :class="titleClass">留下您的足迹</h1>


        <!-- TODO填写编辑样式 -->


        <!-- 关闭按钮 -->
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          Close
        </el-button>
      </template>

      <!-- 写内容 -->
      <ColorPicker />

      <!-- 上传文件 -->
      <h1>上传图片，可选</h1>
      <UploadFile />

      <!-- 输入框,表单,选择标签 -->
      <TitleForm />

      <!-- 选择标签 -->
    </el-drawer>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElButton, ElDrawer } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import {
  Edit
} from '@element-plus/icons-vue'
import ColorPicker from './ColorPicker.vue'
import UploadFile from './UploadFile.vue'
import TitleForm from './ui/titleForm.vue'
const visible = ref(false)

const uploadFile = ref([])


</script>

<style scoped>
#addButton {
  /* 固定在页面的右下角 */
  position: fixed;
  bottom: 20px; /* 距离底部的距离 */
  right: 20px; /* 距离右侧的距离 */
  z-index: 1000; /* 确保按钮在大多数其他内容之上 */
}
</style>