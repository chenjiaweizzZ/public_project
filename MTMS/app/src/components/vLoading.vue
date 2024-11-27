<template>
    <div class='loadLayer'>
        <img src="../assets/images/v-loading.gif" alt="">
    </div>
</template>

<script>
  export default {
    name: 'vLoading'
  }
</script>

<style scoped lang="scss">
    .loadLayer{
        width: 100%;
        height: 100%;
        position:absolute;
        left:0;
        top:0;
        background: #fff;
        z-index:10000;
        >img{
            position:absolute;
            display: block;
            width: 0.3rem;
            height:0.3rem;
            left: 0;
            top:0;
            bottom:0;
            right: 0;
            margin: auto;

        }
    }
</style>
