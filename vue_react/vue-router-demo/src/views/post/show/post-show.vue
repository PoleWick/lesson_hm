<template>
    <div>
        <div>PostShow{{postId}}</div>
        <hr>
        <router-view />
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>

</style>