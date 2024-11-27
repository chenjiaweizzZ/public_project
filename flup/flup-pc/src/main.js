import Vue from 'vue'
import dayjs from 'dayjs'
import qs from 'qs'
import storage from 'good-storage'
import router from './router'
import cookie from 'vue-cookie'
import _ from 'lodash'
import Treeselect from '@riophae/vue-treeselect'
import store from './store'
import './directives/zj-plus-show-overflow-tooltip.js';
// 腾讯统计
// import MtaH5 from 'mta-h5-analysis';





//ui组件
import el from 'element-ui'
// import ts from 'tesla-ui'
import 'element-ui/lib/theme-chalk/index.css'

//自定义全局组件
import FollowupContentHeader from '@/components/followup_content_header'
import OperationHeader from '@/components/operationHeader'

//自定义插件及工具函数
import request from '@/request/api.js'
import { startLoading, stopLoading } from '@/request/index'
import utils from './utils'

import * as filter from './utils/filter'

import * as directives from './utils/directives'

//引入css
import '@/assets/sass/tesla.css'
// import 'tesla-ui/dist/index.css'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import '@/assets/sass/index.scss';

import App from './App'

import md5 from 'js-md5';

Vue.config.productionTip = false;
Vue.use(request)
Vue.use(cookie)
Vue.use(el, { size: 'small' })
// Vue.use(ts)
Vue.component('treeselect', Treeselect)
Vue.component('OperationHeader', OperationHeader)
Vue.component('FollowupContentHeader', FollowupContentHeader)

Vue.prototype.$md5 = md5
Vue.prototype.$isProduction = process.env.NODE_ENV === 'production'
Vue.prototype.$utils = utils
Vue.prototype.$startLoading = startLoading
Vue.prototype.$stopLoading = stopLoading
Vue.prototype.$dayjs = dayjs
Vue.prototype.$qs = qs;
Vue.prototype.$_ = _;
Vue.prototype.$storage = storage
window._ = _
window.qs = qs
window.dayjs = dayjs

Object.keys(filter).forEach(item => {
  Vue.filter(item, filter[item])
})

Object.keys(directives).forEach(k => Vue.directive(k, directives[k]))

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

