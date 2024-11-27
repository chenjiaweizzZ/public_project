import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.prototype.$Vue=Vue
Vue.config.productionTip = false
import Element from 'element-ui'
import '@/assets/scss/element-variables.scss'
Vue.prototype.$Vue=Vue
Vue.use(Element);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
