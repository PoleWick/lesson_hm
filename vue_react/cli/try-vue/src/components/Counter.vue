<template>
    <div class="counter">
    <p>Count:{{ count }}</p>
    <button @click="count++">+1</button>
    </div>
</template>
<script setup>
import { 
    ref 
} from 'vue'

const count = ref(0)

</script>
<style>
.counter {
    text-align: center;
    margin-top:50px;
}
button {
    padding: 10px 20px;
    font-size: 16px;
}
</style>