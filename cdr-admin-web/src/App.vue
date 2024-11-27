<template>
  <div id="app">
    <TopLabel :loading="loading" />
    <keep-alive :include="componentList">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import TopLabel from './components/TopLabel';
export default {
  name: 'App',
  components: {
    TopLabel: TopLabel,
  },
  computed: {
    ...mapState('menu', {
      map: (state) => state.map,
      acitveMenuPath: (state) => state.acitveMenuPath,
      labelArr: (state) => state.labelArr,
    }),
    componentList() {
      let arr = [];
      this.labelArr.forEach((i) => {
        if (i.componentName !== 'SQLConfig') arr.push(i.componentName);
      });
      return arr;
    },
  },
  data() {
    return {
      loading: process.env.VUE_APP_TOPLABEL_LOADIUNG === 'true',
    };
  },
  mounted() {
    window.addEventListener('message', (e) => {
      // console.log('addEventListener message e：', e.origin)
      let { type: msgType, data } = e.data;

      if (msgType === 'MENU_STATUS' && data.isHide === false) {
        console.log('start initLabel');
        /* 初始化label */
        this.initLabel('/dataModelManager');
        this.loading = false;
      } else if (msgType === 'MENU_SELECT') {
        let acitveMenu = this.map.find((i) => {
          return i.menuId === data.menuId;
        });
        if (acitveMenu && this.acitveMenuPath !== acitveMenu.menuUrl) {
          this.$router.push(acitveMenu.menuUrl);
        }
      }
    });
  },
  methods: {
    ...mapMutations('menu', ['initLabel']),
  },
};
</script>

<style lang="scss">
@import './assets/css/normalize.css';
@import '@/assets/scss/main.scss';
</style>
