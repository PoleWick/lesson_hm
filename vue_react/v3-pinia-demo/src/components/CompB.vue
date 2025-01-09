<template>
    <div>
        <h2>CompB</h2>
        <p>count: {{ count }}</p>
    </div>
</template>

<script setup>
import { useCounterStore } from '../store/counter';
const counterStore = useCounterStore();
const { count } = counterStore;
</script>

<style scoped>

</style>