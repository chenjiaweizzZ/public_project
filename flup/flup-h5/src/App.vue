<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view> -->
    <keep-alive :include="keepAliveList">
      <router-view v-if="isRouterAlive"></router-view>
    </keep-alive>
    <bottomTabbar v-if="isShowTabbar" :path.sync="currentPath" />
    <van-popup v-model="inviteShow">
      <invite @answer="answer" @hangup="hangup" @cancel="cancel"></invite>
    </van-popup>
  </div>
</template>

<script>
import bottomTabbar from "./components/bottomTabbar.vue";
import invite from "./components/invitation.vue";
import router from "./router/index.js";
import { mapState, mapMutations, mapActions } from "vuex";
import utils from "@/utils/utils.js";
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload,
    };
  },
  components: {
    bottomTabbar,
    invite,
  },
  data() {
    return {
      isRouterAlive: true,
      currentPath: "",
      whiteList: ["/home", "/core", "/shoppingCart"],
      keepAliveList: [], //需要缓存的路由
      defaultList: [], //默认需要缓存的路由
      popShow: false,
    };
  },
  computed: {
    ...mapState("chat", ["isLogin", "trtcRoomId", "inviteID", "inviteShow"]),
    isShowTabbar() {
      return this.whiteList.includes(this.currentPath);
    },
  },
  created() {
    this.setList(router.options.routes);
  },
  mounted() {
    let onSdkReady = (event) => {
      this.init();
      this.init2();
    };
    this.$chat.on(this.$TencentCloudChat.EVENT.SDK_READY, onSdkReady);
    this.login()
  },
  watch: {
    $route: {
      handler(newPath) {
        console.log(newPath);
        this.currentPath = newPath.path;
        //需要缓存的页面都放到这
        let list = [
          "/addAddress",
          "/map",
          "/healthControl",
          "/firmOrder",
          "/address",
          "/userManagement",
          "/addUserManagement",
          "/userDetails",
          "/chat",
          "/dcwj",
          "/jkxj",
          "/followUpTaskDetails",
          "/feedback",
        ];
        if (list.includes(newPath.path)) {
          //添加地址
          if (newPath.path == "/addAddress" || newPath.path == "/map") {
            if (!this.keepAliveList.includes("addAddress")) {
              this.keepAliveList.push("addAddress");
            }
          } else {
            this.setKeepAliveList("addAddress");
          }
          //商品详情
          if (
            newPath.path == "/healthControl" ||
            newPath.path == "/firmOrder" ||
            newPath.path == "/address" ||
            newPath.path == "/addAddress" ||
            newPath.path == "/map" ||
            newPath.path == "/userManagement" ||
            newPath.path == "/addUserManagement" ||
            newPath.path == "/userDetails"
          ) {
            if (!this.keepAliveList.includes("healthControl")) {
              this.keepAliveList.push("healthControl");
            }
          } else {
            this.setKeepAliveList("healthControl");
          }
          //确认订单
          if (
            newPath.path == "/firmOrder" ||
            newPath.path == "/address" ||
            newPath.path == "/addAddress" ||
            newPath.path == "/map"
          ) {
            if (!this.keepAliveList.includes("firmOrder")) {
              this.keepAliveList.push("firmOrder");
            }
          } else {
            this.setKeepAliveList("firmOrder");
          }
          if (
            newPath.path == "/chat" ||
            newPath.path == "/dcwj" ||
            newPath.path == "/jkxj" ||
            newPath.path == "/followUpTaskDetails"
          ) {
            if (!this.keepAliveList.includes("chat")) {
              this.keepAliveList.push("chat");
            }
          } else {
            this.setKeepAliveList("chat");
          }
          if (newPath.path == "/feedback") {
            this.keepAliveList.push("feedback");
          } else {
            this.setKeepAliveList("feedback");
          }
        } else {
          this.keepAliveList = JSON.parse(JSON.stringify(this.defaultList));
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations("chat", [
      "UpdateMessageList",
      "putMessage",
      "restInfo",
      "setNextReqMessageID",
      "setIsCompleted",
      "setIsLogin",
      "setReferralStatus",
      "setScrollHeight",
      "setScrollHeightProMax",
      "setIsDisabled",
      "setRoomId",
      "setInviteId",
      "setInviteShow",
      "setInviteShowType",
      "setCallName",
      "setRoomId2",
      "setConsultId",
      "setEndate",
      'graphicSustain',
      "setGraphicSustain"
    ]),
    ...mapActions("chat", [
      "loginChat",
      "getHistoryQuery",
      "getPersonalGroupUserInfoList",
    ]),
    init() {
      let that = this;
      if(!this.$route.query.roomId) return
      let promise2 = this.$chat.getMessageList({
        conversationID: `GROUP${this.$route.query.roomId}`,
      });
      promise2
        .then(function (imResponse) {
          console.log("getMessageList",imResponse)
          const messageList = imResponse.data.messageList;
          console.log("messageList",messageList)
          let t1me = utils.formatDate(new Date(), "YYYY-MM-DD HH:mm:ss")
          if(messageList.length) t1me = utils.formatDate2(messageList[0].time)
          that.setEndate(t1me)
          const nextReqMessageID = imResponse.data.nextReqMessageID;
          const isCompleted = imResponse.data.isCompleted;
          that.UpdateMessageList(messageList);
          that.getHistoryQuery({
            roomId: that.$route.query.roomId,
          });
          that.setNextReqMessageID(nextReqMessageID);
          that.setIsCompleted(isCompleted);
          that.$nextTick(() => {
            that.setScrollHeight("messageScrollList");
          });
          setTimeout(() => {
            that.setScrollHeight("messageScrollList");
          }, 1000);
        })
        .catch((err) => {
          console.log("err------------->", err);
          this.setIsDisabled(true);
          let t1me = utils.formatDate(new Date(), "YYYY-MM-DD HH:mm:ss")
          this.setEndate(t1me)
          this.getHistoryQuery({
            roomId: this.$route.query.roomId,
            enddate: utils.formatDate(new Date(), "YYYY-MM-DD HH:mm:ss"),
          });
          this.bottomScroll()
          if (this.$route.name == "chat") {
            this.$toast("服务已过期，如需咨询请重新购买");
          }
        });
      let onMessageReceived = function (event) {
        console.log(event)
        const messageList = event.data;
        let newList = messageList.filter(
          (item) => item.to == this.$route.query.roomId
        );
        if (newList.length > 0) {
          that.putMessage(newList);
          that.setScrollHeightProMax("messageScrollList");
          newList.forEach((elem) => {
            if (
              elem.type == "TIMCustomElem" &&
              elem.payload.description == "成功转诊"
            ) {
              that.setReferralStatus(true);
            } else if (
              elem.type == "TIMCustomElem" &&
              elem.payload.description == "转诊结束"
            ) {
              that.setReferralStatus(false);
            }else if (
              elem.type == "TIMCustomElem" &&
              elem.payload.description == "图文咨询提醒"
              && JSON.parse(elem.payload.data).text == "图文咨询次数用完"
            ) {
              that.setGraphicSustain(0)
            }else if (
              elem.type == "TIMCustomElem" &&
              elem.payload.description == "医生添加图文咨询"
            ) {
              that.setGraphicSustain(1)
            }
          });
        }
      };
      this.$chat.on(
        this.$TencentCloudChat.EVENT.MESSAGE_RECEIVED,
        onMessageReceived,
        this
      );
    },
    login() {
      if (localStorage.getItem("userId") && localStorage.getItem("userSig")) {
        this.loginChat({
          userID: localStorage.getItem("userId"),
          userSig: localStorage.getItem("userSig"),
        }).then((res) => {
          console.log("登录成功callback------------>");
        });
      }
    },
    init2() {
      let that = this;
      let onNewInvitationReceived = function (event) {
        console.log("监听信令123", event,that.$route.path);
        if(that.$route.path == '/call') {
          console.log(123)
          let data = {
            type: 1,
            message: "对方忙线中"
          }
          that.sendMessage(event)
          that.hangup(JSON.stringify(data),event.data.inviteID)
          return
        }
        let { data } = event;
        that.setInviteId(data.inviteID);
        that.setInviteShow(true);
        let message = JSON.parse(data.data);
        console.log(message.consultId)
        that.setInviteShowType("invite");
        that.setCallName(message.userName);
        that.setRoomId(message.roomID);
        that.setRoomId2(message.roomId2);
        that.setConsultId(message.consultId)
      };
      let onInvitationCancelled = function (event) {
        console.log(event)
        that.setInviteShow(false);
        that.setInviteId("");
      };
      let onInvitationTimeout = function (event) {
        console.log(event)
        that.setInviteShow(false);
        that.setInviteId("");
      };
      this.$chat.addSignalingListener(
        this.$TencentCloudChat.TSignaling.INVITATION_TIMEOUT,
        onInvitationTimeout
      );
      this.$chat.addSignalingListener(
        this.$TencentCloudChat.TSignaling.NEW_INVITATION_RECEIVED,
        onNewInvitationReceived
      );
      this.$chat.addSignalingListener(
        this.$TencentCloudChat.TSignaling.INVITATION_CANCELLED,
        onInvitationCancelled
      );
    },
    //初始化缓存路由
    setList(list) {
      this.defaultList = list.reduce((total, item) => {
        if (item.meta && item.meta.keepAlive) {
          total.push(item.name);
        }
        return total;
      }, []);
    },
    //筛选路由
    setKeepAliveList(path) {
      this.keepAliveList = this.keepAliveList.filter((item) => item != path);
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    answer() {
      console.log("answer");
    },
    hangup(data = "",id = "") {
      let that = this;
      console.log("id",id)
      let promise = this.$chat.reject({
        inviteID: id ? id : that.inviteID,
        data: data,
      });
      promise
        .then(function (imResponse) {
          console.log("reject OK", imResponse);
        })
        .catch(function (error) {
          console.warn("reject failed:", error); // 被邀请人拒绝邀请失败
        });
      this.setInviteShow(false);
    },
    sendMessage(event) {
      console.log("event",event)
      let { data } = event;
      let message2 = JSON.parse(data.data);
      let roomId = message2.roomId2
      let consultId = message2.consultId
      let that = this;
      let tips = JSON.stringify({
        type: 13,
        to: "忙线中",
        from: "忙线中",
      });
      let message = this.$chat.createCustomMessage({
        to: roomId,
        conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          description: "TRTCElem",
          data: tips,
        },
        onProgress: function (event) {
          console.log("trtc start", event);
        },
      });
      let promise = that.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          await that.$apis.sendMessageCallback({
              consultId: consultId,
              message: "忙线中",
              sendUserId: JSON.parse(localStorage.getItem('userInfo')).userId,
              sendUserName: JSON.parse(localStorage.getItem('userInfo')).patientName,
          });
          that.$refs.compR00m.handleLeave();
        })
        .catch(function (imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        })
        .finally(() => {});
    },
    cancel() {
      let promise = this.$chat.cancel({
        inviteID: this.inviteID,
        data: "",
      });
      promise
        .then(function (imResponse) {
          // 取消邀请成功
          console.log("cancel OK", imResponse);
        })
        .catch(function (error) {
          console.warn("cancel failed:", error); // 取消邀请失败
        });
      this.setInviteShowType("");
      this.setRoomId("");
      this.setInviteId("");
      this.setInviteShow(false);
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
p {
  margin: 0;
}
#app {
  font-family: PingFangSC-Medium, -apple-system-font, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
