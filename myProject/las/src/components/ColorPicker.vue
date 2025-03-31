<template>
  <h1>简单样式</h1>
  
  <div class="demo-color-block">
    <span class="demonstration">Choose Color</span>
    <el-color-picker v-model="color" show-alpha :predefine="predefineColors"/>
  </div>

  <!-- 预览效果 -->
  <div class="block w-full h-20 text-center" :style="{ background: color,color:textColor }">看看效果</div>


</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 监听颜色，改变背景色
watch(color, (newColor) => {
  console.log(newColor)
})

// 改变对比度
const textColor = computed(() => {
  const rgb = color.value.replace(/^rgba?|\s+|\)$/g, '').split(',');
  const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
  return brightness > 125 ? 'black' : 'white';
});
</script>

<style>
.block {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.demo-color-block {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.demo-color-block .demonstration {
  margin-right: 16px;
}
</style>