<template>
  <section ref="section" class="report"></section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    var redirect = this.getPara('url');
    var code = this.getPara('code');
    // console.log(redirect, code, '1234455555555555555');
    location.href = redirect + '?code=' + code;
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
</style>
