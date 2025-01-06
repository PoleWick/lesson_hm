<template>
    <div>
        <Child ref="comp" />
        <button @click="handleClick">
           按钮
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const comp = ref(null) // 标记DOM 元素 null 组件没有挂载，DOM也不在
const title = ref('hello') // 标记数据
const handleClick = () => {
    console.log(comp.value);
    console.log(title);
}
</script>

<style scoped>

</style>