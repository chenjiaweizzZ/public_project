
import Vue from 'vue'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import router from './router'
import initRouter from './router/router-actions'
import 'babel-polyfill'
import vueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Viewer from "v-viewer"
import "viewerjs/dist/viewer.css"
Vue.use(Viewer)

import store from './store'


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(vueQuillEditor);
initRouter(router)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
