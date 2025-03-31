<!-- <template>
  <div class="container">
    <el-button @click="visible = true" :icon="Edit" circle type="primary" size="large" id="addButton" ></el-button>

    <el-drawer v-model="visible" :show-close="false">
      <template #header="{ close, titleId, titleClass }">


        <h1 :id="titleId" :class="titleClass">评论区</h1>

        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          Close
        </el-button>
      </template>


       <div class="flex flex-wrap border border-amber-300 z-100" v-for="comment in commentList" :key="comment.comment_id">
         <div>
          {{ comment.comment_text }}
          <div class="cursor-pointer">回复</div>
         </div>
       </div>

      <el-form :model="form" ref="formRef">
    <el-form-item>
      <el-input 
        v-model="form.inputValue" 
        clearable 
        placeholder="请输入评论(你被骂了?骂不过或者想说骚话不知道说什么?输入你的需求,来试试D神的威力吧！💣)" 
        type="textarea"
        :autosize="{ minRows: 2 }"
      ></el-input>
    </el-form-item>
    <div>
    <el-button type="primary" @click="submitForm">提交</el-button>
    <el-button type="primary" @click="DGodArrive">D神降临</el-button>  
    </div>
    
  </el-form>
        
    </el-drawer>
  </div>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElButton, ElDrawer } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import {
  Edit
} from '@element-plus/icons-vue'
import { useContentInfoStore } from '../../store/contentInfoStore'
import axios from 'axios'

interface Comments {
  comment_text: string; // 评论内容
  comment_id : number; // 评论ID
}
const visible = ref(false)
const contentInfoStore = useContentInfoStore()
const commentList = ref<Comments[]>([])
const form = ref({
  inputValue: ''
})

const DGodArrive = async() => {
  const res = await axios.get('http://localhost:4000/DGodArrive')
  console.log(res)
  form.value.inputValue =  res.data;
}
const submitForm = async() => {

  const {data} = await axios.post('http://localhost:4000/submitCommits', {
    comment: form.value.inputValue,
    user_id: contentInfoStore.user_id,
    content_id: contentInfoStore.content_id
  })
  console.log(data.data)
}

onMounted(async() => {
  // 获取所有评论
  const result = await axios.get(`http://localhost:4000/getCommits/${contentInfoStore.content_id}`)
  commentList.value = result.data as Comments[]
  console.log(result.data)
})
</script>

<style scoped>
#addButton {
  position: fixed;
  bottom: 20px; 
  right: 20px; 
  z-index: 1000; 
}

</style> -->


<template>
  <div class="container">
    <!-- 浮动按钮添加动画 -->
    <el-button @click="visible = true" :icon="Edit" circle type="primary" size="large" id="addButton"
      class="animate-bounce"></el-button>

    <el-drawer v-model="visible" :show-close="false" size="40%" custom-class="comment-drawer">
      <template #header="{ close }">
        <div class="flex justify-between items-center w-full px-4">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">评论区（{{ commentList.length }}）</h1>
          <el-button type="danger" @click="close" class="!flex items-center gap-1">
            <el-icon>
              <CircleCloseFilled />
            </el-icon>
            <span class="hidden sm:inline">关闭</span>
          </el-button>
        </div>
      </template>

      <!-- 评论列表容器 -->
      <div class="comment-list h-[calc(100vh-220px)] overflow-y-auto p-4">
        <!-- 骨架屏加载状态 -->
        <el-skeleton v-if="loading" :rows="5" animated />

        <!-- 空状态 -->
        <el-empty v-else-if="commentList.length === 0" description="暂无评论，快来抢沙发~" />

        <!-- 评论项 -->
        <div v-for="comment in sortedComments" :key="comment.comment_id"
          class="comment-item group relative p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all">
          <!-- 用户信息 -->
          <div class="flex items-start gap-3">
            <el-avatar :src="comment.user?.avatar || '//oss.aliyuncs.com/xxx/default-avatar.png'" />
            <div class="flex-1">
              <div class="flex items-baseline gap-2">
                <span class="font-medium text-gray-800 dark:text-gray-200">
                  {{ comment.user?.nickname || '匿名用户' }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatTime(comment.created_at) }}
                </span>
              </div>
              <!-- 评论内容 -->
              <div class="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ comment.comment_text }}
              </div>

              <!-- 操作栏 -->
              <div class="flex items-center gap-4 mt-3 text-sm">
                <el-button link type="primary" @click="handleReply(comment)" class="!p-0 hover:!text-blue-600">
                  <el-icon class="mr-1">
                    <ChatDotRound />
                  </el-icon>
                  回复
                </el-button>
                <el-button link :type="comment.is_liked ? 'danger' : 'info'" @click="handleLike(comment)">

                  <el-icon class="mr-1">
                    <template v-if="comment.is_liked">
                      <StarFilled />
                    </template>
                    <template v-else>
                      <Star />
                    </template>
                  </el-icon>
                  {{ comment.like_count || '点赞' }}
                </el-button>
              </div>

              <!-- 嵌套回复 -->
              <div v-if="comment.replies?.length" class="mt-4 ml-8 space-y-4 border-l-2 border-gray-100 pl-4">
                <CommentItem v-for="reply in comment.replies" :key="reply.comment_id" :comment="reply"
                  @reply="handleReply" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论表单 -->
      <div class="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t p-4">
        <el-form :model="form" ref="formRef" @submit.prevent="submitForm">
          <el-form-item>
            <el-input v-model="form.inputValue"
              :placeholder="replyTarget ? `回复@${replyTarget.user.nickname} ：` : '请输入评论...'" type="textarea"
              :autosize="{ minRows: 2 }" resize="none" clearable maxlength="200" show-word-limit />
          </el-form-item>
          <div class="flex justify-between">
            <el-button type="primary" @click="DGodArrive" :loading="dGodLoading">
              <el-icon class="mr-1">
                <MagicStick />
              </el-icon>
              D神代写
            </el-button>
            <div class="space-x-3">
              <el-button @click="cancelReply">取消</el-button>
              <el-button type="primary" native-type="submit" :loading="submitting">
                发送
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Edit,
  CircleCloseFilled,
  ChatDotRound,
  Star,
  StarFilled,
  MagicStick
} from '@element-plus/icons-vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useContentInfoStore } from '../../store/contentInfoStore'
import axios from 'axios'

interface User {
  user_id: number
  nickname: string
  avatar?: string
}

interface Comment {
  comment_id: number
  comment_text: string
  created_at: string
  parent_id?: number
  user: User
  like_count: number
  is_liked: boolean
  replies?: Comment[]
}

// 响应式状态 
const visible = ref(false)
const loading = ref(false)
const submitting = ref(false)
const dGodLoading = ref(false)
const commentList = ref<Comment[]>([])
const replyTarget = ref<Comment | null>(null)
const form = ref({
  inputValue: '',
  parentId: null as number | null
})

// 排序后的评论 
const sortedComments = computed(() => {
  return [...commentList.value].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})


const contentInfoStore = useContentInfoStore()

const handleLike = async (comment: Comment) => {
  try {
    const { data } = await axios.post(`http://localhost:4000/likeComment`, {
      comment_id: comment.comment_id,
      user_id: 1
    })
    comment.is_liked = data.is_liked
    comment.like_count = data.like_count
  } catch (error) {
    console.error(error)
  }
}
// 获取评论 
const fetchComments = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`http://localhost:4000/getCommits/${contentInfoStore.content_id}`)
    commentList.value = buildCommentTree(data)
  } catch (error) {
    ElMessage.error(' 获取评论失败')
  } finally {
    loading.value = false
  }
}

// 构建评论树 
const buildCommentTree = (comments: Comment[]): Comment[] => {
  const map = new Map<number, Comment>()
  const roots: Comment[] = []

  comments.forEach(comment => {
    comment.replies = []
    map.set(comment.comment_id, comment)

    if (!comment.parent_id) {
      roots.push(comment)
    } else {
      const parent = map.get(comment.parent_id)
      parent?.replies?.push(comment)
    }
  })

  return roots
}

// 提交评论 
const submitForm = async () => {
  if (!form.value.inputValue.trim()) return

  try {
    submitting.value = true
    const { data } = await axios.post('http://localhost:4000/submitCommits', {
      comment: form.value.inputValue,
      user_id: contentInfoStore.user_id,
      content_id: contentInfoStore.content_id,
      parent_id: form.value.parentId
    })

    commentList.value = buildCommentTree([...commentList.value, data])
    // resetForm()
    ElMessage.success(' 评论成功')
  } catch (error) {
    ElMessage.error(' 评论失败')
  } finally {
    submitting.value = false
  }
}

// D神代写 
const DGodArrive = async () => {
  try {
    dGodLoading.value = true
    const { data } = await axios.get('http://localhost:4000/DGodArrive')
    form.value.inputValue = data + '\n\n（由D神代写生成）'
  } finally {
    dGodLoading.value = false
  }
}

// 处理回复 
const handleReply = (comment: Comment) => {
  replyTarget.value = comment
  form.value.parentId = comment.comment_id
  form.value.inputValue = `@${comment.user.nickname}  `
}

// 取消回复 
const cancelReply = () => {
  replyTarget.value = null
  form.value.parentId = null
}

// 时间格式化 
const formatTime = (dateString: string) => {
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: zhCN
  })
}

// 初始化加载 
onMounted(fetchComments)
</script>

<style scoped>
#addButton {
  position: fixed;
  bottom: 20px; 
  right: 20px; 
  z-index: 1000; 
}
</style>