<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 上传区域 -->
    <div class="p-4 bg-white shadow-sm">
      <el-upload action="#" :on-change="handleFileChange" :auto-upload="false" :show-file-list="false"
        class="text-center">
        <el-button type="primary" size="medium">
          <i class="el-icon-upload text-lg mr-2"></i>
          选择视频文件
        </el-button>
      </el-upload>

      <el-progress :percentage="uploadPercentage" :stroke-width="16" class="mt-4 max-w-2xl mx-auto" status="success" />
    </div>

    <!-- 视频网格 -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 p-4">
      <div v-for="video in videoList" :key="video.id"
        class="video-wrapper relative bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        style="padding-top: 56.25%">
        <div class="absolute inset-0 flex items-center justify-center">
          <!-- preload="none" -->
          <video :src="`${publicPath}${video.path}`" loading="lazy" decoding="async" controls
            class=" max-w-full max-h-full object-contain" style="transform: scale(0.98)"></video>
        </div>
      </div>
    </div>

    <!-- 生成区域 -->
    <div class="text-center py-8 space-y-4">
      <h2 class="text-xl font-bold text-gray-800">没有找到想要的视频？</h2>
      <el-button type="primary" size="large" @click="generateAiVideo"
        class="generate-btn !px-8 !py-3 !text-lg shadow-lg hover:shadow-xl transition-shadow">
        <i class="el-icon-magic-stick mr-2"></i>
        立即生成AI视频
      </el-button>
      <div v-if="showInputArea">
        <!-- 图片上传区域 -->
        <el-upload class="upload-demo" drag action="" :auto-upload="false" :on-change="handleChange"
            :on-preview="handlePreview"  :limit="1" :on-exceed="handleExceed" :before-upload="beforeUpload"
          multiple>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              Choose image which you want to generate video
            </div>
          </template>
        </el-upload>

        <!-- 发布评论 -->
        <div class="comment-input">
          <el-input v-model="commentContent" placeholder="说出你想要的视频" type="textarea" :min-rows="3"></el-input>
          <el-button @click="submitComment" type="primary">上传</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { progress } from 'motion-v';
import SparkMD5 from 'spark-md5';
import { nextTick, onMounted, onUnmounted, ref, shallowRef } from 'vue';
const showInputArea = shallowRef(false);
const currentFile = ref(null);
const uploadPercentage = ref(0);
const videoUrl = ref('');
const publicPath = 'http://localhost:4000'
const videoList = ref([]);
const commentContent = ref('');
const imgFile = ref(null);


// 初始化懒加载
const initLazyLoad = () => {
  // IntersectionObserver检测元素是否出现在视口中
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target; // 获取被观察的video元素 
        video.src = video.dataset.src; // 将data-src属性值赋给src 
        observer.unobserve(video); // 停止观察该元素 
      }
    });

    // rootMargin设置为'200px'，这意味着观察区域会向外扩展200像素，提前加载即将进入视口的元素。
  }, { rootMargin: '200px' });

  document.querySelectorAll('.lazy-video').forEach(video => {
    observer.observe(video);
  });
};


function handleMetadataLoaded(videoId) {
  const video = this.videoRefs[videoId]
  if (video) {
    const ratio = video.videoWidth / video.videoHeight
    this.$set(this.videoAspectRatios, videoId, ratio)
  }
}
const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview = (file) => {
  console.log(file)
}

const handleChange = (event) => {
  // const file = event.target.files[0];
  console.log(event);
  imgFile.value = event.raw;
  console.log(imgFile.value);
  // fileList.value  = fileList;
  // console.log(fileList.value[0].raw);
}

onMounted(async () => {
  const res = await axios.get('http://localhost:4000/getVideo');
  console.log(res.data);
  videoList.value = res.data;
  nextTick(initLazyLoad); // 初始化懒加载
})
const generateAiVideo = async () => {
  // const res = await axios.get('http://localhost:4000/generateAiVideo');
  // const res = await axios.post('http://localhost:4000/generateAiVideo',commentContent);
  // console.log(res.data);
  showInputArea.value = !showInputArea.value
  // console.log(res.data);
}
const submitInfo = commentContent.value;

const submitComment = async () => {
  try {
    const formData = new FormData();
    formData.append('file',imgFile.value);
    console.log(imgFile.value);
    formData.append('submitInfo', commentContent.value);
    console.log(commentContent.value);
    // 在这里将 submitInfo 作为请求体的一部分发送
    // console.log(commentContent.value);
    
    const res = await axios.post('http://localhost:4000/generateAiVideo',  formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(res.data);
  } catch (error) {
    console.error("There was an error submitting the comment!", error);
  }
}
// 分片计算hash
const calculateHash = (file) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const chunkSize = 2 * 1024 * 1024;
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;

    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      const reader = new FileReader();

      reader.onload = (e) => {
        spark.append(e.target.result);
        currentChunk++;
        currentChunk < chunks ? loadNext() : resolve(spark.end());
      };

      reader.readAsArrayBuffer(file.slice(start, end));
    };

    loadNext();
  });
};

const handleFileChange = async (file) => {
  currentFile.value = file.raw;
  await uploadFile();
}

const uploadFile = async () => {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  const file = currentFile.value;
  if (!file) return;
  console.log("file", file);
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
  console.log("chunkCount", chunkCount);
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  const uploadQueue = [];
  const hash = await calculateHash(file);

  let abortController = new AbortController();

  // 计算MD5
  // const hash = await new Promise((resolve, reject) => {
  //   fileReader.onload = (e) => {
  //     if (!e.target) return;
  //     spark.append(e.target.result);
  //     console.log("spark", spark.end());
  //     resolve(spark.end());
  //   };
  //   fileReader.readAsArrayBuffer(file);
  //   fileReader.onerror = (e) => {
  //     if (!e.target) return;
  //     reject(e.target.error);
  //   }
  // })


  // formData.append('text',"hello world");
  // await axios.post('http://localhost:4000/upload/chunk', formData)

  // 循环上传每个分片
  for (let i = 0; i < chunkCount; i++) {
    const formData = new FormData();
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    // 将分片数据、索引、总分片数和哈希值添加到 FormData 中 
    formData.append('file', chunk);
    formData.append('index', i);
    formData.append('total', chunkCount);
    formData.append('hash', hash);

    // await axios.post('http://localhost:4000/upload/chunk', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // });

    uploadQueue.push(
      axios.post('http://localhost:4000/upload/chunk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: abortController.signal
      }).then(() => {
        uploadPercentage.value = Math.floor(((i + 1) / chunkCount) * 100);
      })
    );
  }


  // 并行控制（3个并发）
  const PARALLEL_LIMIT = 3;
  for (let i = 0; i < uploadQueue.length; i += PARALLEL_LIMIT) {
    await Promise.all(uploadQueue.slice(i, i + PARALLEL_LIMIT));
  }


  // 分片上传完成，发送合并请求
  try {
    const res = await axios.post('http://localhost:4000/upload/merge', {
      filename: file.name,
      total: chunkCount,
      hash: hash,
    });
    console.log(res.data);
    videoUrl.value = res.data.url;
    console.log(videoUrl.value);
    // uploadPercentage.value = 100;
    videoList.value.unshift(res.data);
    uploadPercentage.value = 100;
    // window.location.reload(true)  
  } catch (error) {
    // console.error(error);
    console.error(' 上传失败:', error);
    uploadPercentage.value = 0;
  }
}
// onUnmounted(() => {
//   abortController.abort(); 
// });
</script>

<style scoped>
/* 硬件加速优化 */
video {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* 触摸优化 */
@media (pointer: coarse) {
  video::-webkit-media-controls {
    transform: scale(1.3);
    transform-origin: bottom right;
  }
}
</style>