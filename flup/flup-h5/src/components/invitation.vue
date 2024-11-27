<template>
  <div class="inviteView">
    <div class="inviteView-avatar">
      <img :src=defaultAvatarUrl alt>
    </div>
    <div class="inviteView-tips" v-if="inviteShowType == 'invite'">
      {{ callName }}向您发起视频邀请
    </div>
    <div class="inviteView-options" v-if="inviteShowType == 'invite'">
      <div class="opt1on opt1on1">
        <img :src=answerUrl alt @click="accept">
      </div>
      <div class="opt1on opt1on2">
        <img :src=hangupUrlUrl alt @click="refuse">
      </div>
    </div>
    <div class="inviteView-options" v-else-if="inviteShowType == 'call'">
      <!-- <div class="opt1on opt1on1">
        <img :src=answerUrl alt @click="accept">
      </div> -->
      <div class="opt1on opt1on2">
        <img :src=hangupUrlUrl alt @click="cancel">
      </div>
    </div>
  </div>
</template>

<script>
import avatarUrl from "@/assets/images/avatar.png";
import answerUrl from "@/assets/images/call/answer2.png";
import hangupUrl from "@/assets/images/call/hangup2.png";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("chat", [
      "trtcRoomId",
      "trtcRoomId2",
      "inviteID",
      "callName",
      "inviteShowType",
      "consultId"
    ]),
    defaultAvatarUrl() {
      return avatarUrl;
    },
    answerUrl() {
      return answerUrl;
    },
    hangupUrlUrl() {
      return hangupUrl;
    },
    isShowTabbar() {
      return this.whiteList.includes(this.currentPath);
    },
  },
  methods: {
    ...mapMutations("chat", ["setInviteShow", "putMessage","setToBottom"]),
    accept() {
      this.$router.push({
        path: "/call",
        query: {
          userId: localStorage.getItem("userId"),
          userSig: localStorage.getItem("userSig"),
          roomId: this.trtcRoomId,
          roomId2: this.trtcRoomId2,
          consultId: this.consultId
        },
      });
      this.$chat.accept({
        inviteID: this.inviteID,
        data: "",
      });
      this.setInviteShow(false);
    },
    sendMessage(data,tip) {
      let that = this;
      let message = that.$chat.createCustomMessage({
        to: that.trtcRoomId2,
        conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
        payload: {
          description: "TRTCElem",
          data,
        },
        onProgress: function (event) {
          console.log("trtc start", event);
        },
      });
      that.putMessage(message);
      let promise = that.$chat.sendMessage(message);
      promise
        .then(async function (imResponse) {
          // 发送成功
            await that.$apis.sendMessageCallback({
              consultId: that.consultId,
              message: tip,
              sendUserId: JSON.parse(localStorage.getItem('userInfo')).userId,
              sendUserName: JSON.parse(localStorage.getItem('userInfo')).patientName,
            });
          this.setToBottom(true)
        })
        .catch(function (imError) {
          // 发送失败
          console.warn("sendMessage error:", imError);
        })
        .finally(() => {});
    },
    refuse() {
      let message = JSON.stringify({
        type: 13,
        to: "对方已拒绝",
        from: "已拒绝",
      });
      this.sendMessage(message,'对方已拒绝');
      let data = {
        type: 1,
        message: "对方已拒绝",
      };
      this.$emit("hangup", JSON.stringify(data));
    },
    cancel() {
      let message = JSON.stringify({
        type: 13,
        to: "对方已取消",
        from: "已取消",
      });
      this.sendMessage(message,'对方已取消');
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped lang="scss">
.inviteView {
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(to bottom, #c8c9cc, #82848a);
  &-avatar {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
  }
  &-tips {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0);
    color: #fff;
    font-size: 20px;
    width: 100%;
    text-align: center;
  }
  &-options {
    position: fixed;
    bottom: 20%;
    left: 50%;
    transform: translate(-50%, 0);
    display: flex;
    justify-content: space-around;
    width: 100%;
    // img {
    //     height: 100px;
    //     width: 100px;
    // }
    .opt1on {
      height: 100px;
      width: 100px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .opt1on1 {
      background: #0bb207;
      transition: background-color 0.3s ease;
      &:active {
        background: #008000;
      }
    }
    .opt1on2 {
      background: #fb3a31;
      transition: background-color 0.3s ease;
      &:active {
        background: #d9302a;
      }
    }
  }
}
</style>