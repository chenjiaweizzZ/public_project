// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import FastClick from "fastclick";
import _ from "lodash";
import router from "./router";
import request from "./request/api";
import idCard from "idcard";
import utils from "./utils/utils";
import dayjs from "dayjs";
import widget from "./utils/widget";
import App from "./App";
import VConsole from "vconsole";
import VeLine from "v-charts/lib/line.common";
import CsRuler from "cs-ruler";
import store from './store';
import { DropdownMenu, DropdownItem, Icon, NoticeBar } from "vant";
import "@/assets/sass/sass_index.scss";
import TencentCloudChat from '@tencentcloud/chat';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
import { isMobile } from '@/utils/trtcUtils';
import '@/utils/aegis.js';
import TRTC from 'trtc-js-sdk'
import { Select,Option } from "element-ui";

let options = {
  SDKAppID: store.state.chat.SDKAppID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let chat = TencentCloudChat.create(options); // SDK 实例通常用 chat 表示
chat.setLogLevel(1);
chat.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});
chat.registerPlugin({'tim-profanity-filter-plugin': TIMProfanityFilterPlugin});

Vue.use(Icon);
Vue.component(VeLine.name, VeLine);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.use(CsRuler);
Vue.use(NoticeBar);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);

if(window.globalURL.ICDMApiUrl == 'https://premisd.zwjk.com/flup/api'){
  let vConsole = new VConsole();
}

TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.DEBUG);

Vue.config.productionTip = false;

FastClick.attach(document.body);
Vue.use(request);

Vue.config.ignoredElements = ['wx-open-launch-weapp']

Vue.prototype.$isMobile = isMobile;
Vue.prototype._ = _;
Vue.prototype.$utils = utils;
Vue.prototype.$dayjs = dayjs;
Vue.prototype.$widget = widget;
Vue.prototype.$idCard = idCard;
Vue.prototype.$store = store;
Vue.prototype.$chat = chat;
Vue.prototype.$TencentCloudChat = TencentCloudChat;
Vue.prototype.title = title => {
  document.title = title;
  document.body.scrollTop = 0;
};

import {
  Button,
  Row,
  List,
  Tab,
  Tabs,
  Field,
  Cell,
  CellGroup,
  RadioGroup,
  Radio,
  Popup,
  Picker,
  Area,
  Step,
  Steps,
  Panel,
  Checkbox,
  CheckboxGroup,
  Tag,
  Uploader,
  Toast,
  DatetimePicker,
  Switch,
  Dialog,
  Collapse,
  CollapseItem,
  Stepper,
  Overlay,
  Circle,
  Search,
  Divider,
  Rate,
  ActionSheet,
  Loading,
  SwipeCell,
  Swipe,
  Popover,
  SwipeItem,
  Empty
} from "vant";

Vue.use(Step)
  .use(Steps)
  .use(Area)
  .use(Picker)
  .use(Popup)
  .use(RadioGroup)
  .use(Radio)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Button)
  .use(Row)
  .use(List)
  .use(Tab)
  .use(Tabs)
  .use(Panel)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Tag)
  .use(Uploader)
  .use(Toast)
  .use(Switch)
  .use(Dialog)
  .use(DatetimePicker)
  .use(Collapse)
  .use(CollapseItem)
  .use(Stepper)
  .use(Overlay)
  .use(Circle)
  .use(Divider)
  .use(Search)
  .use(ActionSheet)
  .use(SwipeCell)
  .use(Loading)
  .use(Swipe)
  .use(SwipeItem)
  .use(Empty)
  .use(Popover)
  .use(Rate);

let apiHost = {
  BasePlatform: "",
  BasePlatformApiUrl: "",
  FollowUp: "",
  FollowUpApiUrl: "",
  Questionnaire: "",
  QuestionnaireApiUrl: "",
  //请求后台地址
  ICDMApiUrl: window.globalURL.ICDMApiUrl, //https://zjhmdemoapi.zwjk.com', //'https://icdmapidev.zwjk.com',
  YTHYY: window.globalURL.YTHYY,
  onlineViewUrl: window.globalURL.onlineViewUrl
};
Vue.prototype.$baseURL = apiHost;
//let apiPath = '/api/config/GetModule'
// let apiPath = "http://192.168.1.224:8385/api/wechat/getmodule";
// if (process.env.RUN_MODE === "yq") {
//   apiPath = "/flup/api/config/GetModule";
// }
//  Vue.prototype.$storage.session.set('base_url', apiHost)
//  Vue.prototype.$baseURL = apiHost;
// Vue.prototype.$get(apiPath).then(res => {
//   Vue.prototype.$baseURL = res;

new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
// });

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});
