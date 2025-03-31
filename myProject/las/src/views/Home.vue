<template> 
  <div>
    <TopBar/>
    <router-view></router-view>
    <!-- <WallMessage/> -->
    <AddCard/>
  </div>

</template>

<script lang="ts" setup>
import AddCard from '../components/AddCard.vue';
import TopBar from '../components/TopBar.vue';
import WallMessage from '../components/WallMessage.vue';


</script>