<!--
 * @Description: 房间显示
 * @Date: 2022-03-16 17:40:28
 * @LastEditTime: 2022-03-29 16:13:06
-->
<template>
  <div class="rtc-container">
    <!-- 进房操作区域 -->
    <!-- <p v-if="isHostMode" class="label">Operation</p> -->
    <!-- <div class="control-container">
      <div class="rtc-control-container">
        <el-button
          class="button"
          type="primary"
          size="small" :disabled="isJoining || isJoined" @click="handleJoinRoom">发起视频</el-button>
        <el-button
          v-if="isHostMode"
          class="button"
          type="primary"
          size="small" :disabled="isPublishing || isPublished" @click="handlePublish">Publish</el-button>
        <el-button
          v-if="isHostMode"
          class="button"
          type="primary" size="small" @click="handleUnpublish">Unpublish</el-button>
        <el-button
          class="button"
          type="primary" size="small" @click="handleLeave">结束视频</el-button>
      </div>
      <div v-if="isHostMode" class="screen-share-control-container">
        <el-button
          class="button"
          type="primary"
          size="small"
          :disabled="isShareJoined && isSharePublished"
          @click="handleStartScreenShare">分享屏幕</el-button>
        <el-button
          class="button"
          type="primary" size="small" @click="handleStopScreenShare">停止分享屏幕</el-button>
      </div>
    </div> -->

    <!-- 显示邀请链接 -->
    <!-- <div v-if="showInviteLink" class="invite-link-container">
      <span
        >复制链接邀请好友加入视频通话，一条链接仅可邀请一人，复制后自动更新链接。</span
      >
      <el-input class="invite-input" v-model="inviteLink">
        <template slot="prepend">
          <el-tooltip
            :visibleArrow="false"
            effect="dark"
            content="Copied!"
            placement="bottom"
            :manual="true"
            v-model="showCopiedTip"
          >
            <span class="invite-btn" @click="handleCopyInviteLink">
              <svg-icon icon-name="copy"></svg-icon>
            </span>
          </el-tooltip>
        </template>
      </el-input>
    </div> -->

    <div class="info-container" :class="$isMobile && 'info-container-mobile'">
      <!-- Log 展示区域 -->
      <div
        v-if="isHostMode"
        class="log-container"
        ref="logContainer"
        v-show="false"
      >
        <p class="log-label">Log:</p>
        <div v-for="(item, index) in logList" :key="index">
          <span class="log-state" v-if="item.type === 'success'">🟩 </span>
          <span class="log-state" v-if="item.type === 'failed'">🟥 </span>
          <span>{{ item.log }}</span>
        </div>
      </div>

      <!-- 本地流区域 -->
      <div v-if="localStream" class="local-stream-container">
        <div id="localStream" class="local-stream-content"></div>
        <div v-if="isPlayingLocalStream" class="local-stream-control">
          <div class="video-control control">
            <span v-if="false" @click="muteVideo">
              1
            </span>
            <span v-if="false" @click="unmuteVideo">
              2
            </span>
          </div>
          <div class="audio-control control">
            <span v-if="false" @click="muteAudio">
              1
            </span>
            <span v-if="false" @click="unmuteAudio">
              2
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 远端流区域 -->
    <div class="remote-container">
      <div
        v-for="item in remoteStreamList"
        :key="item.getUserId()"
        :id="item.getUserId()"
        class="remote-stream-container"
      ></div>
    </div>
  </div>
</template>

<script>
import rtc from "./mixins/rtc.js";
import shareRtc from "./mixins/share-rtc.js";
export default {
  name: "compRoom",
  mixins: [rtc, shareRtc],
  props: {
    type: String,
    sdkAppId: Number,
    secretKey: String,
    userId: String,
    userSig: String,
    roomId: String,
    cameraId: String,
    microphoneId: String,
    inviteUserSig: String,
  },
  data() {
    return {
      logList: [],
      inviteLink: "",
      showCopiedTip: false,
    };
  },
  computed: {
    isHostMode() {
      return this.type !== "invite";
    },
    isEnLang() {
      return this.$i18n.locale === "en";
    },
    showInviteLink() {
      return (
        this.isHostMode &&
        (this.isJoined || this.isShareJoined) &&
        this.inviteLink
      );
    },
  },
  watch: {
    cameraId(val) {
      this.switchDevice("video", val);
    },
    microphoneId(val) {
      this.switchDevice("audio", val);
    },
  },
  methods: {
    setAudio(status) {
      console.log(status)
      this.$emit("change", status);
    },
    setVideo(status) {
      console.log(status)
      this.$emit("change2", status);
    },
    generateInviteLink() {
      if (!this.isHostMode) {
        return;
      }
      const { sdkAppId, secretKey, roomId } = this;
      // const inviteUserId = `user_${parseInt(Math.random() * 100000000, 10)}`;
      // const userSigGenerator = new LibGenerateTestUserSig(
      //   sdkAppId,
      //   secretKey,
      //   604800
      // );
      // const inviteUserSig = userSigGenerator.genTestUserSig(inviteUserId);
      const inviteUserId = this.$route.query.inviteUserId
      const inviteUserSig = this.$route.query.inviteUserSig
      this.inviteLink = encodeURI(
        `${location.origin}${location.pathname}#/invite?userSig=${inviteUserSig}&roomId=${Number(roomId)}&userId=${inviteUserId}`
      );
      console.log("this.inviteLink",this.inviteLink);
    },
    handleCopyInviteLink() {
      navigator.clipboard.writeText(this.inviteLink);
      this.showCopiedTip = true;
      setTimeout(() => {
        this.showCopiedTip = false;
      }, 1500);
      this.generateInviteLink();
    },
    // 点击【Join Room】按钮
    async handleJoinRoom() {
      if (this.isHostMode) {
        if (!this.sdkAppId) {
          alert("Please enter sdkAppId and secretKey");
          return;
        }
        if (!this.userId || !this.roomId) {
          alert("Please enter userId and roomId");
          return;
        }
        // const userSigGenerator = new LibGenerateTestUserSig(
        //   this.sdkAppId,
        //   this.secretKey,
        //   604800
        // );
        // this.userSig = userSigGenerator.genTestUserSig(this.userId);
      } else {
        if (
          !this.sdkAppId ||
          !this.inviteUserSig ||
          !this.userId ||
          !this.roomId
        ) {
          alert("Please reacquire the invitation link");
          return;
        }
        this.userSig = this.inviteUserSig;
      }
      await this.initClient();
      await this.join();
      await this.initLocalStream();
      await this.playLocalStream();
      await this.publish();
      // this.generateInviteLink();
      console.log("this.remoteStreamList",this.remoteStreamList)
    },

    // 点击【Publish】按钮
    async handlePublish() {
      await this.publish();
    },

    // 点击【Unpublish】按钮
    async handleUnpublish() {
      await this.unPublish();
    },

    // 点击【Leave Room】按钮
    async handleLeave() {
      await this.leave();
      this.$router.back()
    },

    finished() {
      this.$router.back()
    },

    // 点击【开始屏幕分享】按钮
    async handleStartScreenShare() {
      if (!this.sdkAppId || !this.secretKey) {
        alert("Please enter sdkAppId and secretKey");
        return;
      }
      await this.initShareClient();
      await this.initShareLocalStream();
      await this.handleShareJoin();
      await this.handleSharePublish();
      this.generateInviteLink();
    },

    // 点击【停止屏幕分享按钮】
    async handleStopScreenShare() {
      await this.handleShareUnpublish();
      await this.handleShareLeave();
    },

    // 显示成功的 Log
    addSuccessLog(log) {
      if (!this.isHostMode) {
        return;
      }
      this.logList.push({
        type: "success",
        log,
      });
      const { scrollHeight } = this.$refs.logContainer;
      this.$refs.logContainer.scrollTop = scrollHeight;
    },

    // 显示失败的 Log
    addFailedLog(log) {
      if (!this.isHostMode) {
        return;
      }
      this.logList.push({
        type: "failed",
        log,
      });
      const { scrollHeight } = this.$refs.logContainer;
      this.$refs.logContainer.scrollTop = scrollHeight;
    },
    reportSuccessEvent(name) {
      this.$aegis.reportEvent({
        name,
        ext1: `${name}-success`,
        ext2: "webrtcQuickDemoVue2",
        ext3: this.sdkAppId,
      });
    },
    reportFailedEvent(name, error, type = "rtc") {
      this.$aegis.reportEvent({
        name,
        ext1: `${name}-failed#${this.roomId}*${
          type === "share" ? this.shareUserId : this.userId
        }*${error.message}`,
        ext2: "webrtcQuickDemoVue2",
        ext3: this.sdkAppId,
      });
    },
    test() {
      console.log(1731741);
    },
  },
};
</script>

<style lang="scss" scoped>
.rtc-container {
  .label {
    margin: 14px 0 6px;
    text-align: left;
    font-weight: bold;
  }

  .control-container {
    text-align: left;
    margin-bottom: 10px;
    div:not(:nth-last-child(1)) {
      margin-bottom: 10px;
    }
    .button:not(:first-child) {
      margin-left: 2px;
    }
  }

  .invite-link-container {
    width: 100%;
    color: #084298;
    background-color: #cfe2ff;
    position: relative;
    padding: 10px 16px;
    margin-bottom: 16px;
    border: 1px solid #b6d4fe;
    border-radius: 0.25rem;
    .invite-input {
      margin-top: 10px;
    }
    .invite-btn {
      display: flex;
      cursor: pointer;
    }
  }

  .info-container {
    width: 100%;
    display: flex;
    align-items: start;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 2;
    .log-container {
      flex-grow: 1;
      border: 1px solid #dddddd;
      height: 360px;
      padding: 10px;
      margin-right: 16px;
      overflow-y: scroll;
      .log-label {
        margin: 0 0 6px;
        font-weight: bold;
      }
      .log-state {
        display: inline-block;
        margin-right: 6px;
      }
      > div {
        font-size: 12px;
      }
    }
    .local-stream-container {
      width: 52vw;
      height: 40vw;
      position: absolute;
      right: 0;
      top: 0;
      flex-shrink: 0;
      .local-stream-content {
        width: 100%;
        height: 100%;
      }
      .local-stream-control {
        width: 100%;
        height: 30px;
        position: absolute;
        bottom: 0;
        // background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 10px;
        .control {
          margin-left: 10px;
        }
        .icon-class {
          color: #fff;
          cursor: pointer;
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .info-container-mobile {
    display: block;
    .log-container {
      margin-right: 0;
    }
    .local-stream-container {
      width: 30vw;
      height: 50vw;
      // margin-top: 10px;
    }
  }

  .remote-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .remote-stream-container {
      width: 100vw;
      height: 100vh;
      z-index: 1;
    }
  }
}
</style>


