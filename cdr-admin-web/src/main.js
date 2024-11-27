import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from 'element-ui'
import '@/assets/scss/element-variables.scss'
Vue.prototype.$Vue=Vue
Vue.config.productionTip = false
Vue.use(Element);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
