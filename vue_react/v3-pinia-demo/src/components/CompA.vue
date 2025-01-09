<template>
    <div>
      <h2>CompA</h2>
      <p>count: {{ counterStore.count }}</p>
      <button @click="counterStore.increment">Add</button>
      <CompSubA />
    </div>
  </template>
  
  <script setup>
  import CompSubA from './ComSubA.vue';
  // 引入中央模块
  import { useCounterStore } from '../store/counter'; 
  const counterStore = useCounterStore();// 本地和中央链接的过程
  console.log(counterStore)
  const { count, increment } = counterStore;
  
  </script>
  
  <style scoped>
  
  </style>