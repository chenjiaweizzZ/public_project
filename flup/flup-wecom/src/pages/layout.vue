<template>
  <div class="layout">
    <div class="header">
      <div :class="{ active: activeIndex == index, item }" v-for="(item, index) in tableList" :key="index" @click="addClick(item, index)">{{ item.title }}</div>
    </div>
    <div class="main">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../stores/useStore';
const store = useStore();
const router = useRouter();
const userId = ref('');
const _storage = inject('storage');
const _http = inject('http');
const _apiUrl = inject('apiUrl');
const _utils = inject('utils');
const tableList = ref([
  {
    title: '任务列表',
    path: '/layout/taskList',
    id: '1',
  },
  {
    title: '患者列表',
    path: '/layout/patientList/index',
    id: '2',
  },
]);
const activeIndex = ref(0);
const addClick = (item, index) => {
  activeIndex.value = index;
  router.push(item.path);
};
onMounted(() => {
  // router.push('/layout/taskList');
  // // 前端发送消息，无需跳转到授权页
  _http
    .get(
      _apiUrl.GetJsConfigInfo,
      {
        params: {
          url: 'https://premisd.zwjk.com/flup/web/wecom/#/layout',
          modelid: 678,
          hospitalid: 0,
        },
      },
      {
        appid: 'ylpthta7a91349275b6db541f4177b263ab9c4',
      }
    )
    .then((res) => {
      wx.agentConfig({
        corpid: 'wwb60c6f83e2e67cff', // 必填，企业微信的corpid，必须与当前登录的企业一致
        agentid: res.agentId, // 必填，企业微信的应用id
        timestamp: res.timestamp, // 必填，生成签名的时间戳，后端返回
        nonceStr: res.noncestr, // 必填，生成签名的随机串，后端返回
        signature: res.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法，后端返回
        jsApiList: ['getCurExternalContact', 'sendChatMessage'], //必填，传入需要使用的接口名称，名称就是企业微信文档中的那些api的名字
        // 成功
        success: function (res) {
          console.log('注入应用权限成功', res);
          // 注入应用权限成功后，获取外部人员userid，和当前客服人员id
          wx.invoke('getCurExternalContact', {}, function (res) {
            if (res.err_msg == 'getCurExternalContact:ok') {
              userId.value = res.userId;
              store.setUserId(res.userId);
              _storage.setLocalStorage('userId', res.userId);
              router.push('/layout/taskList');
              console.log(res.userId, '外部人员userid');
            } else {
              //错误处理
            }
          });
          // 获取用户信息
          _http
            .get(
              _apiUrl.getUserInfo,
              {},
              {
                appid: 'ylpthta7a91349275b6db541f4177b263ab9c4',
              }
            )
            .then((res) => {
              _storage.setLocalStorage('userInfo', res);
            });
        },
        // 失败
        fail: function (res) {
          console.log('注入应用权限失败', res);
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级');
          }
        },
      });
    });
});
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  .header {
    height: 40px;
    padding: 0 10px;
    background: #eef6ff;
    box-shadow: 0px 0.5px 0px 0px #d4d4d4;
    display: flex;
    align-items: flex-end;
    .item {
      flex: 1;
      cursor: pointer;
      height: 28px;
      line-height: 28px;
      text-align: center;
      color: #305680;
    }
    .active {
      background: #a1cdff;
      font-weight: 600;
    }
  }
  .main {
    height: calc(100% - 58px);
  }
}
</style>
