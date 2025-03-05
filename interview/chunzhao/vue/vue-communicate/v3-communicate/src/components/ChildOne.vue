<template>
    <div>
        ChildOne
        {{ msg1 }}
        {{ msg2 }}
    </div>
</template>

<script>
export default {
       props: ['msg1', 'msg2'],
       setup(props) {
           console.log(props.msg1, props.msg2)
       } 
}
</script>

<style scoped>

</style>