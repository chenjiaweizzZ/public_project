<template>
  <div class="global-style" :class="{content:showMenu,loginContent:!showMenu}">
    <bread-crumb></bread-crumb>
    <router-view></router-view>
  </div>
</template>
<script>
  import breadCrumb from '@/components/breadcrumb'
  import { mapState, mapActions } from 'vuex';

  export default {
    components: {
      breadCrumb
    },
    computed: {
      ...mapState(['sysType']),
      showMenu: function () {
        return this.$route.path.indexOf('/login') == -1;
      }
    },
    created() {
      this.initSysType()
      this.checkToken()
    },
    methods: {
      ...mapActions(['initSysType', 'checkToken']),
    }
  }
</script>

<style  scoped>
.global-style {
  height: 100%;
}
</style>

