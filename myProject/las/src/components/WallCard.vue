<!-- <template>
  <div class="flex flex-wrap gap-4">
  <div  class="cursor-pointer" v-for="content in Contents" :key="content.content_id" >
    <div @click="ToDetail(content.content_id)">
    <CardContainer>
      <CardBody
        class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
        <CardItem :translate-z="50" class="text-xl font-bold text-neutral-600 dark:text-white">
          {{ content.title }}
        </CardItem>
        <CardItem as="p" translate-z="60" class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
          {{ content.subtitle }}
        </CardItem>
        <CardItem :translate-z="100" :rotate-x="20" :rotate-z="-10" class="mt-4 w-full">

          <img :src="`${publicPath}${content.image_url || '/uploads/aa.jpg'}`" height="1000" width="1000"
            class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl" alt="thumbnail" />
        </CardItem>
        <div class="mt-20 flex items-center justify-between">
          <CardItem :translate-z="20" :translate-x="-40" as="a" href="https://rahulv.dev" target="__blank"
            class="rounded-xl px-4 py-2 text-xs font-normal dark:text-white">
            {{ content.created_at }}
          </CardItem>
          <CardItem :translate-z="20" :translate-x="40" as="button"
            class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black">
            Get Started
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue';
import CardBody from './ui/CardBody.vue';
import CardContainer from './ui/CardContainer.vue';
import CardItem from './ui/CardItem.vue';
import axios from 'axios';

import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
const authStore = useAuthStore();
interface Content {
  id: number;
  content_id: number;
  created_at: string;
  subtitle: string;
  title: string;
  text_content: string;
  image_url: string;
  user_id: number;
  // 添加其他可能的属性
}
const router = useRouter()


const Contents: Ref<Content[]> = ref([])  // 明确 Contents 是 Content 类型的数组
const publicPath = 'http://localhost:4000'
// 当页面渲染的时候，发送请求获取图片数据
onMounted(() => {
  getContents()
})

const getContents = async () => {
  const { data } = await axios.get('http://localhost:4000/getContents')
  Contents.value = data as Content[];  // 确保 data 被类型断言为 Content[]
  if (Contents.value.length <= 0) {
    return
  }

  console.log(Contents.value);
}


const ToDetail = (content_id: number) => {
  console.log(content_id);
  router.push(`/contentDetail/${content_id}`)  
}
</script> -->



<template>
  <div class="container mx-auto p-4">
    <!-- 加载状态 -->

 
    <!-- 正常内容 -->
    <div class="flex flex-wrap gap-4">
      <div 
        v-for="content in contents"
        :key="content.content_id" 
        class="cursor-pointer w-full sm:w-[30rem]"
        @click="toDetail(content.content_id)" 
      >
        <CardContainer>
          <CardBody class="group/card relative size-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
            <CardItem :translate-z="50"
            class="text-xl font-bold text-neutral-600 dark:text-white">
              {{ content.title  }}
            </CardItem>
            
            <CardItem  as="p"
          translate-z="60"
          class="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300">
              {{ content.subtitle  }}
            </CardItem>
 
            <CardItem  :translate-z="100"
          :rotate-x="20"
          :rotate-z="-10"
          class="mt-4 w-full">
              <img 
                :src="`${apiBaseUrl}${content.image_url}?width=600`" 
                loading="lazy"
                decoding="async"
                width="600"
                height="400"
                class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                @load="handleImageLoad"
                alt="Content thumbnail"
              />
            </CardItem>
 
            <div class="mt-6 flex items-center justify-between">
              <CardItem
            :translate-z="20"
            :translate-x="40"
            as="button"
            class="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
          >
                {{ formatDate(content.created_at)  }}
              </CardItem>
              <el-button variant="outline">
                更多 
              </el-button>
            </div>
          </CardBody>
        </CardContainer>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts" setup>
import { ref, shallowRef, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
// import type { Content } from '@/types/content'
 
// Components 
import CardBody from './ui/CardBody.vue';
import CardContainer from './ui/CardContainer.vue';
import CardItem from './ui/CardItem.vue';

interface Content {
  id: number;
  content_id: number;
  created_at: string;
  subtitle: string;
  title: string;
  text_content: string;
  image_url: string;
  user_id: number;
  // 添加其他可能的属性
}
const router = useRouter()
const apiBaseUrl = "http://localhost:4000"
 
// 响应式状态 
const contents = shallowRef<Content[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
 
// 生命周期钩子 
onMounted(() => {
  getContents()
})
 
// 图片加载处理 
const handleImageLoad = (event: Event) => {
  const img = event.target  as HTMLImageElement 
  img.classList.remove('opacity-0') 
  img.classList.add('opacity-100') 
}
 
// 数据获取方法 
const getContents = async () => {
  try {
    loading.value  = true 
    error.value  = null 
    
    const { data } = await axios.get<Content[]>(`${apiBaseUrl}/getContents`,  {
      params: {
        cache: new Date().getTime() // 避免浏览器缓存 
      }
    })
 
    contents.value  = data 
  } catch (err) {
    console.error('Failed  to fetch contents:', err)
    error.value  = 'Failed to load contents. Please try again later.'
  } finally {
    loading.value  = false 
  }
}
 
// 日期格式化 
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
 
// 路由跳转 
const toDetail = (contentId: number) => {
  router.push(`/contentDetail/${contentId}`) 
}
</script>
 
<style scoped>
/* 图片加载过渡效果 */
img {
  transition: opacity 0.3s ease-in-out;
}
 
/* 减少布局偏移 */
img:not([src]) {
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;
}
 
@keyframes shine {
  to {
    background-position-x: -200%;
  }
}
 
@media (prefers-color-scheme: dark) {
  img:not([src]) {
    background: linear-gradient(110deg, #2d2d2d 8%, #404040 18%, #2d2d2d 33%);
  }
}
</style>
