<template>
  <div class="nodata-box">
    <div class="nodata-img">
      <img src="~@/assets/images/noTable.png" alt="" width="100%" />
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.nodata-box {
  text-align: center;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  .nodata-img {
    max-width: 340px;
  }
}
</style>
