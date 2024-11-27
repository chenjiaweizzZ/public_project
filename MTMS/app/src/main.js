/**
 * Created by Jern Chan 2023/11/3
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './router'
import routerInit from './router/router-actions'
import $ from 'jquery'
import infiniteScroll from './config/infiniteScroll'
import './scss/disabled.css'
import wx from "weixin-js-sdk"
Vue.prototype.$wx = wx;


window.jQuery = window.$ = $;
import * as filters from './config/filters'
import App from './App'

Vue.use(VueRouter);
routerInit(router);
import vuescroll from 'vuescroll/dist/vuescroll-slide';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll)


import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/icon.css';
Vue.use(ElementUI)

// import KeyBoard from '@/components/wc-keyboard';
// Vue.use(KeyBoard);



Vue.directive('infiniteScroll', infiniteScroll)


Vue.filter('substr', filters.substr)
Vue.filter('substring', filters.substring)

$.ajaxSetup({
  cache: false
});
router.beforeEach((to, from, next)=>{
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()

})

new Vue({
  router,
  ...App
}).$mount('#app');

