import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";
import "@/assets/css/index.scss";
import App from "./App.vue";
const app = createApp(App);

// 解决 ElTable 自动宽度高度导致的「ResizeObserver loop limit exceeded」问题
const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
};
// 注：根据ui在决定使用element还是vant组件库
// 全局引入element-plus样式
import "element-plus/dist/index.css";
// 按需引入element-plus组件
// import {
//   ElButton,
//   ElMenu,
//   ElMenuItem,
//   ElForm,
//   ElFormItem,
//   ElInput,
//   ElImage,
//   ElDialog,
//   ElTable,
//   ElTableColumn,
//   ElRadio,
//   ElDrawer,
//   ElDateTimePicker,
// } from "element-plus";
import ElementPlus from 'element-plus'
// app.component(ElButton.name, ElButton);
// app.component(ElMenu.name, ElMenu);
// app.component(ElMenuItem.name, ElMenuItem);
// app.component(ElForm.name, ElForm);
// app.component(ElFormItem.name, ElFormItem);
// app.component(ElInput.name, ElInput);
// app.component(ElImage.name, ElImage);
// app.component(ElDialog.name, ElDialog);
// app.component(ElTable.name, ElTable);
// app.component(ElTableColumn.name, ElTableColumn);
// app.component(ElRadio.name, ElRadio);
// app.component(ElDrawer.name, ElDrawer);
// app.component(ElDateTimePicker.name, ElDateTimePicker);
app.use(ElementPlus)
// 通过app.provide全局注册一个属性
import { storage } from "./storage";
import http from "./server/index";
import apiUrl from "./server/api";
import utils from "./utils/utils";
app.provide("storage", storage);
app.provide("http", http);
app.provide("apiUrl", apiUrl);
app.provide("utils", utils);

// vue-router
import router from "./router";

// 自定义全局组件
import IconRefresh from "./components/IconRefresh.vue";
app.component("IconRefresh", IconRefresh);

app.use(createPinia()).use(router).mount("#app");
