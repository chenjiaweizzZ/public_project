<template>
  <section ref="section" class="report">
    <div v-if="tips" class="tips">该机构尚未开通商城，请联系管理员！</div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      tips: true,
    };
  },
  created() {},
  mounted() {
    this.$apis.getMallBackstageUrl().then((res) => {
      console.log(res);
      if (res != 'unknown') {
        location.href = res;
        this.tips == false;
      } else {
        this.tips == true;
      }
    });
  },
  methods: {
    getPara(name) {
      var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
      if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
      return '';
    },
  },
};
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.report {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .tips {
    margin: auto;
    font-size: 18px;
    color: #333;
  }
}
</style>
