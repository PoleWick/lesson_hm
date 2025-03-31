<template>
  <div>
    <div v-if="selectType === 1">
      <p>{{wallType[0].name}}</p>
      <p>{{wallType[0].slogan}}</p>
          <div>
      <el-button v-for="label in labels" :key="label.index" @click="setIndex(label.index)">
        {{ label.name }}
      </el-button>

      <!-- 放图片的位置，采用grid布局 -->
    </div class="flex flex-row">
    <div class="flex">
      <WallCard/>

    </div>
    <div class="flex">
    </div>
    </div>

    <div v-if="selectType === 2">
      <p>{{wallType[1].name}}</p>
      <p>{{wallType[1].slogan}}</p>
      <ImgWall/>
    </div>
    
    <div v-if="selectType === 3">
      <p>{{wallType[2].name}}</p>
      <p>{{wallType[2].slogan}}</p>
      <!-- <ImgWall/> -->
      <Video/>
    </div>
    <!-- 使用V-for渲染label -->

    <!-- <UploadFile/> -->

    
  </div>
</template>
<script lang="ts" setup>
import { wallType, labels } from '../utils/data';
import EventBus from '../lib/event-bus';
import { ref } from 'vue';
import WallCard from './WallCard.vue';
import ImgWall from './ImgWall.vue';
import Video from './Video.vue';

// 接受兄弟emit过来的数据
const selectType = ref(1);
EventBus.on('changeWall',(value: any)=> {
  console.log(value);
  selectType.value = value;
})

const setIndex = (index: number) => {
  console.log(index);
  EventBus.emit('changeIndex', index);
}
</script>
<style lang="">

</style>