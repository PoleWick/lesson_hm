<template>
    <div>
        PostIndex
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute() // 当前路由
// console.log(route);
const { postId } = route.params // 参数对象
</script>

<style scoped>

</style>