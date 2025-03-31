<template>
  <div :class="cn('w-full', $props.class)" @dragover.prevent="handleEnter" @dragleave="handleLeave"
    @drop.prevent="handleDrop" @mouseover="handleEnter" @mouseleave="handleLeave">
    <div class="group/file relative block w-full cursor-pointer overflow-hidden rounded-lg p-10" @click="handleClick">
      <input ref="fileInputRef" type="file" class="hidden" @change="onFileChange" />

      <!-- Grid pattern -->
      <div
        class="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <slot />
      </div>

      <!-- Content -->
      <div class="flex flex-col items-center justify-center">
        <p class="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
          Upload file
        </p>
        <p class="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400 dark:text-neutral-400">
          Drag or drop your files here or click to upload
        </p>

        <div class="relative mx-auto mt-10 w-full max-w-xl space-y-4">
          <Motion v-for="(file, idx) in files" :key="`file-${idx}`" :initial="{ opacity: 0, scaleX: 0 }"
            :animate="{ opacity: 1, scaleX: 1 }"
            class="relative z-40 mx-auto flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-white p-4 shadow-sm md:h-40 dark:bg-neutral-900">
            <div class="flex w-full items-center justify-between gap-4">
              <el-button @click="handleRemove(idx)">
                取消上传
              </el-button>
              <el-button @click="handleUpload(file, idx)">
                确认上传
              </el-button>
            </div>
            <div class="flex w-full items-center justify-between gap-4">
              <Motion as="p" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
                class="max-w-xs truncate text-base text-neutral-700 dark:text-neutral-300">
                {{ file.name }}
              </Motion>
              <Motion as="p" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
                class="w-fit shrink-0 rounded-lg px-2 py-1 text-sm text-neutral-600 shadow-input dark:bg-neutral-800 dark:text-white">
                {{ (file.size / (1024 * 1024)).toFixed(2) }} MB
              </Motion>
            </div>

            <div
              class="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-600 md:flex-row md:items-center dark:text-neutral-400">
              <Motion as="p" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }"
                class="rounded-md bg-gray-100 px-1.5 py-1 text-sm dark:bg-neutral-800">
                {{ file.type || "unknown type" }}
              </Motion>
              <Motion as="p" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }">
                modified {{ new Date(file.lastModified).toLocaleDateString() }}
              </Motion>
            </div>
          </Motion>

          <template v-if="!files.length">
            <Motion as="div"
              class="relative z-40 mx-auto mt-4 flex h-32 w-full max-w-32 items-center justify-center rounded-md bg-white shadow-[0px_10px_50px_rgba(0,0,0,0.1)] group-hover/file:shadow-2xl dark:bg-neutral-900"
              :initial="{
                x: 0,
                y: 0,
                opacity: 1,
              }" :transition="{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }" :animate="isActive
                    ? {
                      x: 20,
                      y: -20,
                      opacity: 0.9,
                    }
                    : {}
                  ">
              <el-icon :size="20">
                <Edit />
              </el-icon>
            </Motion>

            <div
              class="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-32 items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent transition-opacity"
              :class="{ 'opacity-100': isActive, 'opacity-0': !isActive }"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type HTMLAttributes } from "vue";
import { cn } from "../../lib/utils";
import { Motion } from "motion-v";
import axios from "axios";

import { useAuthStore } from '../../store/authStore'



interface FileUploadProps {
  class?: HTMLAttributes["class"];
}

defineProps<FileUploadProps>();

const emit = defineEmits<{
  (e: "onChange", files: File[]): void;
}>();

const imgUrl = ref<string>("");
const fileInputRef = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const isActive = ref<boolean>(false);

const maxFiles = ref(1); // 最大文件数量
// 允许的格式文件,所有图片格式
const allowedFormats = ref(["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "application/pdf"]);


function handleFileChange(newFiles: File[]) {
  for (const file of newFiles) {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif' && file.type !== 'image/webp' && file.type !== 'application/pdf') {
      console.error('Invalid file format');
      return;
    }
  }

  const filteredFiles = newFiles.filter(file => allowedFormats.value.includes(file.type));

  // 如果文件数量超过最大限制，则报错
  for (const file of filteredFiles) {
    console.log(file.type);
  }
  if (files.value.length + filteredFiles.length > maxFiles.value) {
    console.error(`Cannot upload more than ${maxFiles.value} files.`);
    return;
  }
  files.value = [...files.value, ...newFiles];

  emit("onChange", files.value);
}

// 将文件上传到服务器
async function handleUpload(file: File, index: number) {
  const authStore = useAuthStore();
  const user_id  = authStore.user_id;
  // 文件上传逻辑
  const formData = new FormData();
  formData.append("image", file);
  formData.append("user_id",user_id)
  try {

    const response = await axios.post("http://localhost:4000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    console.log(response.data);
    imgUrl.value = response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

function handleRemove(index: number) {
  files.value.splice(index, 1);
  emit("onChange", files.value);
}
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  handleFileChange(Array.from(input.files));
}

function handleClick() {
  fileInputRef.value?.click();
}

function handleEnter() {
  isActive.value = true;
}
function handleLeave() {
  isActive.value = false;
}
function handleDrop(e: DragEvent) {
  isActive.value = false;
  const droppedFiles = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
  if (droppedFiles.length) handleFileChange(droppedFiles);
}
</script>

<style scoped>
.group-hover\/file\:shadow-2xl:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.25);
}

.transition-opacity {
  transition: opacity 0.3s ease;
}
</style>