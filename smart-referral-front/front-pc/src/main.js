import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "element-plus/dist/index.css";
import "@/assets/scss/index.scss";
import App from "./App.vue";
import router from "./router";
import { http } from "./utils/http";
import msg from "./utils/msg";
import utils from "./utils/utils";
import { apiUrl } from "./utils/api";
import btn from '@/directives/btn'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// 通过 app.provide 注册全局属性
app.provide("apiUrl", apiUrl);
app.provide("http", http);
app.provide("msg", msg);
app.provide("utils", utils);
app.use(pinia);
app.use(router);
app.use(btn);

app.mount("#app");
