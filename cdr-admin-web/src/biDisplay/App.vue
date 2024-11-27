<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {
    document.title = '大屏预览'
  },
  methods: {}
}
</script>

<style lang="scss">
@import '../assets/css/normalize.css';
</style>
