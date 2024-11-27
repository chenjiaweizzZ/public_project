<template>
  <div class="wxIndex">
    <wx-home v-if="active == 0"></wx-home>
    <wx-message v-show="active == 1" @getUnread="getUnread"></wx-message>
    <wx-user v-show="active == 2"></wx-user>
    <van-tabbar v-model="active">
      <van-tabbar-item>
        <span>首页</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.homeActive : icon.home" />
      </van-tabbar-item>
      <van-tabbar-item icon="chat-o" :badge="msgNum">
        <span>消息</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.messageActive : icon.message" />
      </van-tabbar-item>
      <van-tabbar-item icon="user-o">
        <span>我的</span>
        <img slot="icon" slot-scope="props" :src="props.active ? icon.userActive : icon.user" />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import wxHome from "./components/wxHome";
import wxMessage from "./components/wxMessage";
import wxUser from "./components/wxUser";
import { Tabbar, TabbarItem } from "vant";
import $ from "jquery";
import methods from "../../methods";
import { mapState, mapActions } from "vuex";
export default {
  name: "wxIndex",
  components: {
    wxHome,
    wxMessage,
    wxUser
  },
  data() {
    return {
      active: 0,
      msgNum: "",
      icon: {
        home: require("../../assets/images/wxHome.png"),
        homeActive: require("../../assets/images/wxHomeActive.png"),
        message: require("../../assets/images/wxMessage.png"),
        messageActive: require("../../assets/images/wxMessageActive.png"),
        user: require("../../assets/images/wxUser.png"),
        userActive: require("../../assets/images/wxUserActive.png")
      }
    };
  },
  created() {
    let self = this;
    self.getView();
    self.clearMenusId()
  },
  watch: {
    active() {
      window.scrollTo(0, 0);
    },
    deep: true
  },
  methods: {
    ...methods,
    getView() {
      let self = this;
      if (self.$route.query.view) {
        let view = self.$route.query.view;
        if (view == "message") {
          self.active = 1;
        } else if (view == "my") {
          self.active = 2;
        } else {
          self.active = 0;
        }
      }
    },
    getUnread(num) {
      let self = this;
      self.msgNum = num;
    },
    clearMenusId() {
      localStorage.setItem("menuId", "");
    }
  }
};
</script>

<style lang="scss">
.wxIndex {
  .van-tabbar {
    z-index: 99;
    .van-tabbar-item {
      .van-tabbar-item__text {
        span {
          font-size: 10px;
          letter-spacing: 0.2px;
          text-align: center;
          font-weight: 500;
        }
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
.popCBox {
  width: 40%;
  height: 350px;
  overflow: scroll;
}

.popKBox {
  width: 60%;
  height: 350px;
  overflow: scroll;
  padding-bottom: 80px;
}
.rotationc {
  .van-popup {
    height: 350px;
    transform: translate3d(0%, 0%, 0);
    overflow: hidden;
  }
  .popCK {
    display: flex;
    height: 350px;
  }
  .van-sidebar {
    width: 100%;
    height: 350px;
    padding-bottom: 48px;
  }
  .van-sidebar-item--select:before {
    background-color: #0079fd;
  }
}
</style>