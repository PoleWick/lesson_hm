<template>
    <div>
        <EmitChlid @myClick="onMyClick"/>
    </div>
</template>

<script setup>
import EmitChlid from './EmitChlid.vue';
const onMyClick = (msg) => {
    console.log(msg);
}
</script>

<style scoped>

</style>