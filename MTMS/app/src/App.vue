<template>
  <div id="app">
    <router-view />
    <c-alert></c-alert>
    <c-confirm></c-confirm>
    <c-loading></c-loading>
    <c-toast></c-toast>
    <s-loading :loading='loading' :loading-icon="loadicon"></s-loading>
  </div>
</template>

<script>
import store from './vuex/store';
import $ from 'jquery';
import '@/config/jquery.cookie';
import cAlert from '@/components/alert';
import cConfirm from '@/components/confirm';
import cLoading from '@/components/loading';
import cToast from '@/components/toast';
import sLoading from '@/components/service-loading';
import '@/config/viewport';
export default {
  name: 'App',
  components: {
    cAlert,
    cConfirm,
    cLoading,
    cToast,
    sLoading
  },
  store,
  data() {
    return {
      loading: false,
      loadicon: false
    }
  },
}
</script>

<style lang="scss">
  @import "./scss/common.scss";
  @import "./scss/index.scss";
  @import "./scss/manage.css";
  #app {
    height: 100%
  }
</style>
