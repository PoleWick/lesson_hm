<template>
  <div class="space-y-4">
    <div 
      v-for="(comment, index) in comments"
      :key="index"
      class="p-3 bg-gray-50 rounded-lg"
    >
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <h3 class="font-medium">{{ comment.author  }}</h3>
          <p class="text-gray-600 text-sm">{{ comment.content  }}</p>
          <div class="text-xs text-gray-400 mt-1">
            {{ formatDate(comment.date)  }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const comments = ref([
  {
    author: '用户1',
    content: '这是一个示例评论',
    date: new Date()
  }
])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>