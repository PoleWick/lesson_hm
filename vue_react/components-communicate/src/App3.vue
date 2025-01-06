<template>
    <div>
        <h2>父组件</h2>
        <p>来自子组件的消息:{{ messageFromChild }}</p>
        <ChildComponent @child-message="handleChildMessage" :title="title"/>

        
    </div>
</template>

<script setup>
// @ 事件 不是js 内置事件，自定义事件 
// 父子组件通信
import { ref } from 'vue'
import ChildComponent from './components/ChildComponent.vue'

const title = ref("来自父组件的消息")
const messageFromChild = ref('')
// 自定义事件 child-message 父子组件间的约定 子组件调用child-message 父组件监听
const handleChildMessage = (message) => {
    console.log('来自子组件的消息', message)
}
</script>

<style scoped>

</style>