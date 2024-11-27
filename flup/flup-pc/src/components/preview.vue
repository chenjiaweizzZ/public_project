<template >
  <div class="previewBox">
    <iframe :src="src"></iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: '',
    }
  },
  created() {
    this.src = decodeURIComponent(this.$route.query.src)
  },
}
</script>
<style lang="scss">
.previewBox {
  width: 100%;
  height: inherit;
  iframe {
    width: 100%;
    height: inherit;
  }
}
</style>