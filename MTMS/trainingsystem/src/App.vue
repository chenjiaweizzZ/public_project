<template>
  <div id="app">
    <!-- <span class="appPageTitle" v-if="$route.meta">{{$route.meta.title}}</span> -->
    <router-view></router-view>
  </div>
</template>

<script>

  export default {
    name: 'app',
  }
</script>

<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #fff;
    /* padding: 0 20px;
    padding-top: 15px; */

  }

  /* html {
    font-size: 16px;
    height: 100%;
  } */

  body,html {
    /* background: rgb(242, 242, 242); */
    font-size: 16px;
    margin: 0;
    height: 100%;
  }

  .appPageTitle {
    padding-bottom: 15px;
    color: #97a8be;
    font-size: 14px;
  }
</style>