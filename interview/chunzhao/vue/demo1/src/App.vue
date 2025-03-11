<template>
  <div>

  </div>
</template>

<script setup>
// import { reactive, effect } from '@vue/reactivity'
import { 
  reactive, 
  effect 
} from './reactivity'

const ret = reactive({
  num: 0,
  age: 1
})
// console.log(ret.num);
// const ret = reactive(0)
let val ;
effect(()=>{
  // 依赖地图 
  val = ret.num 
  // ret.age
  ret.num
})

effect(()=>{
  // 依赖地图 
  // val = ret.num 
  ret.age
  console.log('///////////////////')
})


// console.log(val);
// ret.num;
// console.log(val);
ret.num = 10;
console.log(val);
ret.age = 22;
</script> 

<style  scoped>

</style>