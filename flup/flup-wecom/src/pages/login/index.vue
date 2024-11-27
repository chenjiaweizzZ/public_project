<template>
  <div class="empower">授权中。。。</div>
</template>
<script setup>
import { ref, onMounted, inject } from "vue";
const qwInfoCode = ref(""); // code
const _storage = inject("storage");
const _http = inject("http");
const _apiUrl = inject("apiUrl");
const getCode = () => {
  // 获取code参数
  var url = decodeURI(decodeURI(location.search));
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  qwInfoCode.value = theRequest.code; //保存code
  return theRequest.code;
};

const oauth = () => {
  location.href =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wwb60c6f83e2e67cff&redirect_uri=https://premisd.zwjk.com/flup/web/wecom/#/login&response_type=code&scope=snsapi_base&state=STATE&agentid=1000078#wechat_redirect";
};

onMounted(() => {
  if (getCode()) {
    // code5分钟没有使用会过期
    _storage.setLocalStorage("qwInfoCode", qwInfoCode.value);
    location.href = "https://premisd.zwjk.com/flup/web/wecom/#/layout";
  } else {
    // code 不存在进行授权
    oauth();
  }
});
</script>
<style lang="scss" scoped>
.empower {
  position: relative;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}
</style>
