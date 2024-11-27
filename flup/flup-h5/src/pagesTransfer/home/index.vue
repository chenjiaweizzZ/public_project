<template>
  <div class="home">
    <div class="home-head">
    </div>
    <div class="menuList">
        <div
          class="menuList-item"
          v-for="item in menuList"
          :key="item.id"
        >
          <div v-if="item.type == 1" class="menuList-item__container" @click="jump(item.path)">
            <div class="menuList-item__imgWrap">
              <img class="menuList-item__img" :src="item.imageUrl" alt="" />
            </div>
            <span class="menuList-item__text">{{ item.label }}</span>
          </div>
          <div v-if="item.type == 2" class="menuList-item__container">
            <div class="menuList-item__imgWrap">
              <img class="menuList-item__img" :src="item.imageUrl" alt="" />
            </div>
            <span class="menuList-item__text menuList-item__text2">{{ item.label }}</span>
            <div style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;">
              <wx-open-launch-weapp
              id="launch-btn"
              :appid="item.appid"
              :path="item.path"
              @launch="onLaunch"
              @error="onError"
              style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;z-index: 999;"
            >
              <script type="text/wxtag-template">
                <style>div { height:100%; width: 100%; position: absolute; top: 0; right: 0; bottom: 0; left: 0; opacity: 0.1; background: 'blue' }</style>
                <div>1231</div>
              </script>
            </wx-open-launch-weapp>
            </div>
          </div>
        </div>
      </div>
    <div class="home-info">
      <!-- <template v-if="orderList && orderList.length">
        <div class="home-info__title">
          <span class="home-info__text">我的专属服务</span>
        </div>
        <service :orderList="orderList"></service>
      </template> -->
      <my-health-plan></my-health-plan>
      <div class="home-info__title home-info__title_stretch" v-if="!healthControlHidden" @click="viewTeamDetail()">
        <span class="home-info__text">健康管理</span>
        <!-- <img src="@/assets/images/home/you.png"> -->
        <!-- <van-search v-model="value" shape="round" background="#F3F7F5" placeholder="请输入查询的内容" input-align="center" clearable @input="searchInput" /> -->
      </div>
      <manage-team></manage-team>
      <!-- <manage v-if="!healthControlHidden"></manage> -->
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import health from "@/assets/images/home/health.png";
import publicGood from "@/assets/images/home/publicGood.png";
import characteristic from "@/assets/images/home/knowleadge.png";
import inquiry from "@/assets/images/home/inquiry.png";
import wx from "weixin-js-sdk"
import manage from "./components/manage.vue";
import manageTeam from "./components/manageTeam.vue";
import service from "./components/service.vue";
import myHealthPlan from './components/myHealthPlan.vue';
export default {
  components: {
    manage,
    manageTeam,
    service,
    myHealthPlan
  },
  data() {
    return {
      menuList: [
        {
          id: 0,
          imageUrl: inquiry,
          label: "在线咨询",
          path: "/featuredService2?packageType=1",
          type: 1  
        },
        {
          id: 1,
          imageUrl: publicGood,
          label: "健康管理",
          path: "/featuredService?packageType=2",
          type: 1 
        },
        {
          id: 2,
          imageUrl: characteristic,
          label: "健康知识",
          path: "/knowledge",
          type: 1 
        },
        // {
        //   id: 4,
        //   imageUrl: characteristic,
        //   label: "减重减脂服",
        //   path: '',
        //   type: 2,
        //   appid: 'wxe347483ea749554f',
        //   path: 'pages/index/newIndex/newIndex'
        // },
        {
          id: 3,
          imageUrl: health,
          label: "健康商城",
          path: "https://xiangya-zjhmmall.zwjk.com/",
          type: 1
        },
        // {
        //   id: 1,
        //   imageUrl: publicGood,
        //   label: "公益服务",
        //   path: "",
        // },
        // {
        //   id: 2,
        //   imageUrl: characteristic,
        //   label: "特色服务",
        //   path: "/featuredService",
        // },
        // {
        //   id: 3,
        //   imageUrl: inquiry,
        //   label: "快速问诊",
        //   path: "",
        // },
      ],
      openId:'',
      orderList:[],
      value: ""
    };
  },
  computed:{
    ...mapState('chat',['healthControlHidden']),
  },
  created() {
    this.setHomeModule()
  },
  mounted() {
    document.title = '首页';
    this.getOrderList();
    // this.openId =
    //   this.$route.query.openId ||
    //   this.openId ||
    //   (sessionStorage.getItem("userInfo")
    //     ? JSON.parse(sessionStorage.getItem("userInfo")).openId
    //     : "");
    // if (!this.openId) {
    //   if (location.search.indexOf("openId=") != -1) {
    //     let openIdRule = new RegExp("(^|&)openId=([^&]*)(&|$)");
    //     let openIdValue = window.location.search.substr(1).match(openIdRule);
    //     if (openIdValue[2]) {
    //       this.openId = openIdValue[2];
    //     }
    //   } else {
    //     if (this.$route.query.code) {
    //       this.getOpenId(this.$route.query.code);
    //     } else if (location.search.indexOf("code=") != -1) {
    //       let code = new RegExp("(^|&)code=([^&]*)(&|$)");
    //       let codeValue = window.location.search.substr(1).match(code);
    //       this.getOpenId(codeValue[2]);
    //     }
    //   }
    // } else {
    //   sessionStorage.setItem("openId", this.openId);
    // }
    this.init();
  },
  methods: {
    ...mapMutations('chat',['updateHealthControl']),
    ...mapMutations("tabs", ["setFeaturedServiceTab","setFeaturedServiceCurrentIndex2","setFeaturedServiceCurrentIndex"]),
    ...mapActions('chat', ['getUnreadMessage']),
    //获取openid
    async init() {
      let res = await this.$apis.getWxConfigParam({
                url: window.location.href.split("#")[0],
            });
            let info = res.retData;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: info.appId, // 必填，公众号的唯一标识
                timestamp: info.timestamp, // 必填，生成签名的时间戳
                nonceStr: info.nonceStr, // 必填，生成签名的随机串
                signature: info.signature, // 必填，签名
                jsApiList: ["chooseImage"],
                openTagList: ["wx-open-launch-weapp"], // 必填，需要使用的JS接口列表
            });
    },
    async getOpenId(id) {
      let res = await this.$apis.getOpenIdByCode({ code: id });
      if (res.retData && res.retData.openId) {
        this.openId = res.retData.openId;
        sessionStorage.setItem('openId', this.openId)
      }
    },
    //获取列表数据
    async getOrderList(){
      let params = {
        pageNo:1,
        pageSize:9999,
        flowStatus:'',
      }
      let { retData } = await this.$apis.getOrderList(params);
      this.getUnreadMessage();
      this.orderList = retData.list.filter(item => item.flowStatus == 1 || item.flowStatus == 2 || item.flowStatus == 3 || item.flowStatus == 4 || item.flowStatus == 8);
    },
    jump(path) {
      if (!path) {
        this.$toast("功能开发中");
        return false;
      }
      this.setFeaturedServiceCurrentIndex("")
      this.setFeaturedServiceCurrentIndex2("")
      let reg = /^http(s)?:\/\/.+/;
      if(reg.test(path)){
        window.location.href = path;
      }else{
        this.$router.push(path);
      }
    },
    setHomeModule() {
      if(this.$route.query.healthControlHidden) {
        if(this.$route.query.healthControlHidden == 'true') {
          this.updateHealthControl(true)
        }
      }
    }, 
    onLaunch(res) {
      console.log("res:",res)
    },
    onError(err) {
      console.log("err:",err)
    },
    viewTeamDetail() {
      this.setFeaturedServiceCurrentIndex("")
      this.setFeaturedServiceTab("2");
      this.$router.push({
        path: "/featuredService",
        query: {
          packageType: 2,
        }
      })
      // this.$router.push({
      //   path: "/submit",
      //   query: {
      //     back: true
      //   }
      // })
    }
  },
};
</script>
<style scoped lang="scss">
.home {
  height: calc(100vh - 69px);
  background-color: #f3f7f5;
  overflow-y: auto;
  &-head {
    width: 100%;
    height: 192px;
    background-image: url("../../assets/images/home/bgImage.png");
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    margin-bottom: -60px;
  }
  .menuList {
      // position: absolute;
      // left: 12px;
      // right: 12px;
      // top: 143px;
      z-index: 1000;
      position: sticky;
      top: 0;
      border-radius: 8px;
      margin: 0 10px;
      display: flex;
      padding: 11px 17px;
      background-color: #fff;
      box-shadow: 0px 2px 6px 0px rgba(103, 158, 133, 0.2);
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      &-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        //border-radius: 8px;
        //background-color: #fff;
        //padding: 10px 0px;
        //box-shadow: 0px 2px 6px 0px rgba(103, 158, 133, 0.2);
        &__container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        &:active{
          .menuList-item__imgWrap{
            &::before{
              opacity: 1;
            }
          }
        }
        &__imgWrap{
          width: 50px;
          height: 50px;
          position: relative;
          &::before{
            content: '';
            position: absolute;
            left:0;
            top:0;
            z-index: 1;
            width: 100%;
            height: 100%;
            background-image: url('../../assets/images/icon/overlying.png');
            background-size: cover;
            opacity: 0;
          }
        }
        &__img {
          width: 50px;
          height: 50px;
        }
        &__text {
          font-weight: 600;
          color: #111111;
          font-size: 16px;
          line-height: 22px;
          margin-top:7px;
        }
        &__text2 {
          font-size: 15px;
        }
      }
    }
  &-info {
    padding: 10px 12px 14px 12px;
    &__title {
      color: #111111;
      line-height: 22px;
      font-size: 17px;
      font-weight: 600;
      z-index: 1000;
      position: sticky;
      top: 100px;
      background-color: #f3f7f5;
      img {
        height: 14px;
        width: 14px;
        position: relative;
        top: 2px;
      }
    }
    &__title_stretch {
      .home-info__text {
        line-height: 10px;
      }
    }
    &__text {
      display: inline-block;
      background-image: url("../../assets/images/home/line.png");
      background-repeat: no-repeat;
      background-position: 0 13px;
      background-size: contain;
      line-height: 17px;
      height: 22px;
    }
  }
}
</style>