<template>
  <div class="TUIChat TUIChat">
    <div class="TUIChat-main">
      <!-- 安全提示 -->
      <!-- <div class="TUIChat-safe-tips">
        <span>
          {{
            "TUIChat.【安全提示】本 APP 仅用于体验腾讯云即时通信 IM 产品功能，不可用于业务洽谈与拓展。请勿轻信汇款、中奖等涉及钱款的信息，勿轻易拨打陌生电话，谨防上当受骗。"
          }}
        </span>
        <a @click="openComplaintLink(Link.complaint)">{{
          "TUIChat.点此投诉"
        }}</a>
      </div>
      <div
        class="TUIChat-application-tips"
        v-if="isGroup && groupApplicationCount > 0"
        @click="toggleApplicationList()"
      >
        <span
          >{{ groupApplicationCount }}{{ "TUIChat.条入群申请" }}
          <span class="application-tips-btn">{{ "TUIChat.点击处理" }}</span>
        </span>
      </div>-->
      <!-- 消息列表 -->
      <ul class="TUI-message-list" ref="messageListRef" id="messageScrollList" @touchstart="handstartScroll" @scroll="debounce">
        <p class="message-more" @click="getHistoryMessageList" v-if="isCompleted === false">点击查看更多</p>
        <li v-for="(item, index) in messageList" :key="item.ID" :id="'tui-' + item.ID" ref="messageElementListRef" class="message-li">
          <!-- 消息时间组件 -->
          <MessageTimestamp :currTime="item.time" :prevTime="index > 0 ? messageList[index - 1].time : 0"></MessageTimestamp>
          <div class="message-item" @click.stop="toggleID = ''">
            <!-- <MessageTip
              v-if="
                item.type === TYPES.MSG_GRP_TIP ||
                isMessageTip(item)
              "
              :content="item"
            />-->
            <div
              v-if="!item.isRevoked && !isSignalingMessage(item)"
              @longpress="handleToggleMessageItem($event, item, true)"
              @click.prevent.right="handleToggleMessageItemForPC($event, item)"
              @touchstart="handleH5LongPress($event, item, 'touchstart')"
              @touchend="handleH5LongPress($event, item, 'touchend')"
              @mouseover="handleH5LongPress($event, item, 'touchend')"
              @touchmove="handleH5LongPress($event, item, 'touchend')"
            >
              <!-- <div v-if="!item.isRevoked && !isSignalingMessage(item)"> -->
              <MessageBubble :messageItem="item" :content="item" :blinkMessageIDList="blinkMessageIDList" @resendMessage="resendMessage(item)" @blinkMessage="blinkMessage">
                <MessageText v-if="item.type === TYPES.MSG_TEXT" :content="handleTextMessageShowContext(item)" :messageItem="item" />
                <ProgressMessage v-if="item.type === TYPES.MSG_IMAGE" :content="handleImageMessageShowContext(item)" :messageItem="item">
                  <MessageImage :content="handleImageMessageShowContext(item)" :messageItem="item" @uploading="handleUploadingImageOrVideo" @previewImage="handleImagePreview" />
                </ProgressMessage>
                <MessageAudio v-if="item.type === TYPES.MSG_AUDIO" :newData="handleAudioMessageShowContext(item)" />
                <!-- <ProgressMessage
                  v-if="item.type === TYPES.MSG_VIDEO"
                  :content="item"
                  :messageItem="item"
                >
                  <MessageVideo
                    :content="item"
                    :messageItem="item"
                    @uploading="handleUploadingImageOrVideo"
                  />
                </ProgressMessage>-->
                <!-- <MessageAudio
                  v-if="item.type === TYPES.MSG_AUDIO"
                  :content="item"
                  :messageItem="item"
                />
                <ProgressMessage
                  v-if="item.type === TYPES.MSG_FILE"
                  :content="item"
                  :messageItem="item"
                >
                  <MessageFile :content="item" />
                </ProgressMessage>
                <MessageFace
                  v-if="item.type === TYPES.MSG_FACE"
                  :content="item"
                  :isPC="false"
                />
                <MessageLocation
                  v-if="item.type === TYPES.MSG_LOCATION"
                  :content="item"
                />-->
                <MessageCustom
                  v-if="item.type === TYPES.MSG_CUSTOM"
                  :content="item.payload"
                  :messageItem="item"
                  @uploading="handleUploadingImageOrVideo"
                  @previewImage="handleImagePreview2"
                  @previewVideo="handleImagePreview3"
                  @scroll="scrollCustom"
                />
              </MessageBubble>
            </div>
            <!--
              <MessagePlugin
              v-else-if="!item.isRevoked"
              :message="item"
              :blinkMessageIDList="blinkMessageIDList"
              @resendMessage="resendMessage"
              @handleToggleMessageItem="handleToggleMessageItem"
              @handleH5LongPress="handleH5LongPress"
            />
            -->

            <MessageRevoked v-else :isEdit="item.type === TYPES.MSG_TEXT" :messageItem="item" @messageEdit="handleEdit(item)" />
            <MessageTool
              :class="[
                'message-tool',
                item.flow === 'out' ? 'message-tool-out' : 'message-tool-in',
              ]"
              :messageItem="item"
              v-if="toolShow(item)"
            />
          </div>
          <message-grade v-if="item.type == 'TIMCustomElem' && restInfo(item.payload).type == 11" :message="item" @grade="grade(item)"></message-grade>
          <message-prescription v-if="item.type == 'TIMCustomElem' && restInfo(item.payload).type == 14" :message="item" @viewPrescription="viewPrescription"></message-prescription>
          <div class="ai-tip" v-if="item.type == 'TIMCustomElem' && restInfo(item.payload).type == 7">以上内容由AI提供,仅供参考,如需专业建议,可咨询个管师或医护团队。</div>
          <div v-if="item.type == 'TIMCustomElem' && restInfo(item.payload).type == 7 && aiEnabled" class="ai-control-btn">
            <van-divider dashed :style="{ color: '#999999', borderColor: '#999999', padding: '0px' }">
              <span @click="setAiStatus(false)">关闭AI助手</span>
            </van-divider>
          </div>
        </li>
        <!-- <div
          class="to-bottom-tip"
          @click="jumpToLatestMessage"
          v-if="isShowJumpToLatest"
        >
          <Icon v-if="getdoubleArrowIcon()" :file="getdoubleArrowIcon()" width="10px" height="10px"></Icon>
          <div class="to-bottom-tip-text">
            {{ "TUIChat.回到最新位置" }}
          </div>
        </div>-->
      </ul>
      <Dialog
        class="resend-dialog"
        v-if="reSendDialogShow"
        :show="reSendDialogShow"
        :isH5="false"
        :center="true"
        :isHeaderShow="false"
        @submit="resendMessageConfirm()"
        @update:show="(e) => (reSendDialogShow = e)"
      >
        <p class="delDialog-title">{{ "TUIChat.确认重发该消息？" }}</p>
      </Dialog>
      <van-dialog
        v-model="gradeShow"
        title="满意度调查问卷"
        @confirm="gradeConform"
        :show-cancel-button="!gradeOnlyRead"
        theme="round-button"
        confirm-button-color="#32AE57"
        cancel-button-color="#FF9035"
        :confirm-button-text="gradeOnlyRead ? '确定' : '提交评价'"
      >
        <grade ref="messageGrade"></grade>
      </van-dialog>
      <gallery :images="picList" :index="index" @close="index = null" ref="gy"></gallery>
      <div class="viewPic" @click="test()" v-show="index !== null">
        <van-icon name="search" />查看原图
      </div>
    </div>
  </div>
</template>
<script>
import VueGallery from 'vue-gallery';
import wx from 'weixin-js-sdk';
import { ImagePreview } from 'vant';
import { _handleTextMessageShowContext } from './utils/decodeText.js';
import { JSONToObject } from './utils/utils';
import MessageTimestamp from './message-elements/message-timestamp.vue';
import MessageTip from './message-elements/message-tip.vue';
import MessageBubble from './message-elements/message-bubble.vue';
import TUIChatEngine from '@tencentcloud/chat-uikit-engine';
import MessageText from './message-elements/message-text.vue';
import MessageGrade from './message-elements/message-grade.vue';
import MessagePrescription from './message-elements/message-prescription.vue';
import grade from './message-elements/grade.vue';
import ProgressMessage from '../common/ProgressMessage/index.vue';
import doubleArrowIcon from '../assets/icon/double-arrow.svg';
import Icon from '../common/Icon.vue';
import MessageRevoked from './message-tool/message-revoked.vue';
import MessageImage from './message-elements/message-image.vue';
import { CHAT_SCROLL_TYPE } from '../constant';
import MessageTool from './message-tool/index.vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import MessageCustom from './message-elements/message-custom.vue';
import MessageAudio from './message-elements/message-audio.vue';
import utils from '@/utils/utils.js';
import mixin from '../mixin';
//   import MessagePlugin from "../../plugins/plugin-components/message-plugin.vue";
export default {
  components: {
    MessageTimestamp,
    MessageTip,
    MessageBubble,
    MessageText,
    ProgressMessage,
    Icon,
    MessageRevoked,
    MessageImage,
    MessageTool,
    MessageCustom,
    MessageAudio,
    MessageGrade,
    grade,
    MessagePrescription,
    gallery: VueGallery,
  },
  // 自定义指令 实现可拖动
  directives: {
    drag(el, bindings) {
      el.onmousedown = function(e) {
        var disx = e.pageX - el.offsetLeft
        var disy = e.pageY - el.offsetTop
        document.onmousemove = function (e) {
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
        }
      }
    }
  },
  mixins: [mixin],
  props: {
    groupID: {
      type: String,
      default: '',
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      TYPES: TUIChatEngine.TYPES,
      blinkMessageIDList: [],
      toggleID: '',
      isShowJumpToLatest: true,
      reSendDialogShow: false,
      showImagePreview: false,
      showGroupApplication: false,
      messageHighlight: '',
      timer: null,
      isLongpressing: false,
      resendMessageData: '',
      currentImagePreview: '',
      debounce: utils.debounce(this.handScroll, 500),
      gradeShow: false,
      recordId: '',
      gradeOnlyRead: false,
      index: null,
      startY: 0,
    };
  },
  computed: {
    ...mapState('chat', ['messageList', 'isCompleted', 'isDisabled', 'currentpage', 'aiEnabled', 'picList', 'endate']),
    imageMessageList() {
      return this.messageList.filter((item) => {
        return !item.isRevoked && item.type === this.TYPES.MSG_IMAGE;
      });
    },
  },
  activated() {
    if (sessionStorage.getItem('scrollTop')) {
      document.getElementById('messageScrollList').scrollTop = sessionStorage.getItem('scrollTop');
      sessionStorage.removeItem('scrollTop');
    }
    this.init();
    // this.filterAiTips()
  },
  methods: {
    ...mapActions('chat', ['getMessageList', 'getHistoryQuery']),
    ...mapMutations('chat', ['resetMessage', 'setScrollHeightProMax', 'setPreScrollHeight', 'setReferralStatus', 'setAiEnable']),
    async init() {
      let res = await this.$apis.getWxConfigParam({
        url: window.location.href.split('#')[0],
      });
      let info = res.retData;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: info.appId, // 必填，公众号的唯一标识
        timestamp: info.timestamp, // 必填，生成签名的时间戳
        nonceStr: info.nonceStr, // 必填，生成签名的随机串
        signature: info.signature, // 必填，签名
        jsApiList: ['previewImage'], // 必填，需要使用的JS接口列表
      });
    },
    handstartScroll() {
      let ipt = document.getElementById('editor');
      if (ipt == document.activeElement) {
        this.$nextTick(() => {
          ipt.blur();
        });
      }
      this.$emit('iptBlur');
    },
    async getHistoryMessageList() {
      let oldHeight = this.$refs.messageListRef.scrollHeight;
      let oldMessageList = [...this.messageList];
      // if(this.currentpage == 1) {
      //   this.currentpageSetTwo()
      // }
      // if(this.isDisabled){
      //   await this.getHistoryQuery({
      //     roomId:this.$route.query.roomId,
      //     enddate:utils.formatDate(new Date(),'YYYY-MM-DD HH:mm:ss'),
      //   })
      // }else{
      //   await this.getMessageList(this.$route.query.roomId);
      // }
      await this.getHistoryQuery({
        roomId: this.$route.query.roomId,
        // enddate: this.endate
      });
      this.$nextTick(() => {
        this.$refs.messageListRef.scrollTop = this.$refs.messageListRef.scrollHeight - oldHeight;
      });
      // console.log(oldMessageList.length,this.messageList.length)
      if (oldMessageList.length == this.messageList.length) {
        this.getHistoryMessageList();
      }
    },
    isCreateGroupCustomMessage() {},
    isSignalingMessage(message) {
      // return (
      //   message.type === this.TYPES.MSG_CUSTOM && message.getSignalingInfo()
      // );
      return false;
    },
    blinkMessage() {},
    jumpToLatestMessage() {},
    handleUploadingImageOrVideo() {
      this.setScrollHeightProMax('messageScrollList');
    },
    isMessageTip(message) {
      if (
        message.type === TIM.TYPES.MSG_GRP_TIP ||
        (message.type === TIM.TYPES.MSG_CUSTOM &&
          message.conversationType === TIM.TYPES.CONV_GROUP &&
          JSONToObject(message.payload.data).businessID === constant.TYPE_CALL_MESSAGE) ||
        (message.type === TIM.TYPES.MSG_CUSTOM && message.conversationType === TIM.TYPES.CONV_GROUP && JSONToObject(message.payload.data).businessID === 'group_create')
      ) {
        return true;
      }
      return false;
    },
    handleImageMessageShowContext(item) {
      return {
        progress: item.status === 'unSend' && item.progress,
        url: item.payload.imageInfoArray[0].url,
        width: item.payload.imageInfoArray[0].width,
        height: item.payload.imageInfoArray[0].height,
        message: item,
      };
    },
    handleH5LongPress(e, message, type) {
      let that = this;
      function longPressHandler() {
        clearTimeout(that.timer);
        // let distanceY = e.touches[0].pageY - that.startY
        that.handleToggleMessageItem(e, message);
      }
      function touchStartHandler() {
        // console.log('touchStartHandler',e)
        that.startY = e.touches[0].pageY;
        that.timer = setTimeout(longPressHandler, 500);
      }
      function touchEndHandler() {
        // console.log('touchEndHandler',e)
        clearTimeout(that.timer);
      }
      switch (type) {
        case 'touchstart':
          touchStartHandler();
          break;
        case 'touchend':
          touchEndHandler();
          setTimeout(() => {
            that.isLongpressing = false;
          }, 200);
          break;
      }
    },
    handleToggleMessageItem(e, message, isLongpress = false) {
      if (isLongpress) {
        this.isLongpressing = true;
      }
      this.toggleID = message.ID;
    },
    handScroll(e) {
      this.setPreScrollHeight(e.target.scrollHeight);
    },
    // 重发消息
    resendMessage(message) {
      // this.reSendDialogShow = true;
      // this.resendMessageData = message;
      let that = this;
      this.resetMessage(message);
      this.scrollToTargetInWeb();
      let promise = this.$chat.resendMessage(message); // 传入需要重发的消息实例
      promise
        .then(async function ({ data }) {
          let info = data.message;
          let text = '';
          if (info.type == 'TIMTextElem') {
            text = info.payload.text;
          } else if (info.type == 'TIMImageElem') {
            text = '图片';
          } else if (info.type == 'TIMSoundElem') {
            text = '语音消息';
          }
          // 重发成功
          if (that.$route.query.preSales == 1) {
            await that.$apis.personalSendMessageCallback({
              consultId: that.$route.query.consultId,
              message: text,
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
            });
          } else {
            await that.$apis.sendMessageCallback({
              consultId: that.$route.query.consultId,
              message: text,
              sendUserId: that.$route.query.patientId,
              sendUserName: that.$route.query.patientName,
            });
          }
        })
        .catch(function (imError) {
          // 重发失败
          console.warn('resendMessage error:', imError);
        });
      console.log(message);
    },
    handleEdit(message) {
      this.emits('handleEditor', message, 'reedit');
    },
    getdoubleArrowIcon() {
      return doubleArrowIcon;
    },
    handleImagePreview(message) {
      if (this.showImagePreview || this.currentImagePreview || this.isLongpressing) {
        return;
      }
      let { url } = this.handleImageMessageShowContext(message);
      let images = this.imageMessageList.map((item) => this.handleImageMessageShowContext(item)).map((item) => item.url);
      console.log(images, 111);
      let startPosition = images.indexOf(url);
      ImagePreview({
        images,
        startPosition,
      });
    },
    handleImagePreview2(image) {
      if (this.showImagePreview || this.currentImagePreview || this.isLongpressing) {
        return;
      }
      let index = 0;
      this.picList.forEach((item, i) => {
        if (item.href == image) {
          index = i;
        }
      });
      this.index = index;
      // let index = this.picList.indexOf(image)
      // if(index == -1) {
      //   let images = [image]
      //   ImagePreview({
      //     images,
      //     startPosition: 0,
      //   });
      // }else {
      //   let images = this.picList
      //   ImagePreview({
      //     images,
      //     startPosition: index,
      //   });
      // }
    },
    handleImagePreview3(image) {
      if (this.showImagePreview || this.currentImagePreview || this.isLongpressing) {
        return;
      }
      console.log('picList', this.picList, image);
      let index = 0;
      this.picList.forEach((item, i) => {
        if (item.href == image) {
          index = i;
        }
      });
      this.index = index;
      // let index = this.picList.indexOf(image)
      // if(index == -1) {
      //   let images = [image]
      //   ImagePreview({
      //     images,
      //     startPosition: 0,
      //   });
      // }else {
      //   let images = this.picList
      //   ImagePreview({
      //     images,
      //     startPosition: index,
      //   });
      // }
    },
    handleTextMessageShowContext(item) {
      return _handleTextMessageShowContext(item);
    },
    scrollToTargetInWeb() {
      this.$nextTick(() => {
        console.log(127391731);
        this.$refs.messageListRef.scrollTop = this.$refs.messageListRef.scrollHeight;
      });
    },
    handleToggleMessageItemForPC(e, message) {},
    handleAudioMessageShowContext(item) {
      return {
        progress: item.status === 'unSend' && item.progress,
        url: item.payload.url || item.payload.remoteAudioUrl,
        message: item,
        second: item.payload.second,
      };
    },
    scrollCustom() {
      setTimeout(() => {
        this.$parent.bottomScroll();
      }, 200);
    },
    setAiStatus() {
      let consultId = this.$route.query.consultId;
      if (this.$route.query.preSales == 1) {
        this.$apis.changePreAiStatus(consultId).then((res) => {
          this.getPersonalConsultDetailsById();
        });
      } else {
        this.$apis.changeAiStatus(consultId).then((res) => {
          this.getConsultDetailsById();
        });
      }
    },
    getPersonalConsultDetailsById() {
      this.$apis
        .getPersonalConsultDetailsById({
          personalConsultId: this.$route.query.consultId,
        })
        .then((res) => {
          if (res.retData) {
            this.setReferralStatus(res.retData.referralStatus);
            this.setAiEnable(res.retData.aiEnabled == '1' ? true : false);
          } else {
            this.setReferralStatus(false);
          }
        });
    },
    getConsultDetailsById() {
      this.$apis.getConsultDetailsById({ consultId: this.$route.query.consultId }).then((res) => {
        if (res.retData) {
          this.setReferralStatus(res.retData.referralStatus);
          this.setAiEnable(res.retData.aiEnabled == '1' ? true : false);
        } else {
          this.setReferralStatus(false);
        }
      });
    },
    filterAiTips() {
      let listEl = document.querySelector('.TUI-message-list');
      let aiConTrolBtnEls = listEl.querySelectorAll('.ai-control-btn');
    },
    grade(item) {
      this.recordId = JSON.parse(item.payload.extension).recordId;
      this.gradeShow = true;
      this.$apis.getSatisfaction(JSON.parse(item.payload.extension).recordId).then((res) => {
        if (res.retData.sumValue) {
          let gradeChild = this.$refs.messageGrade;
          this.gradeOnlyRead = true;
          this.$nextTick(() => {
            gradeChild.init(res.retData.sumValue, res.retData.procedureValue, res.retData.serviceValue, res.retData.advice, true);
          });
        } else {
          this.gradeShow = true;
          let gradeChild = this.$refs.messageGrade;
          this.gradeOnlyRead = false;
          this.$nextTick(() => {
            gradeChild.init();
          });
        }
        console.log(this.gradeShow);
      });
    },
    gradeConform() {
      if (this.gradeOnlyRead) {
        this.gradeShow = false;
      } else {
        let gradeChild = this.$refs.messageGrade;
        this.$apis
          .submitSatisfaction({
            sumValue: gradeChild.sumValue,
            procedureValue: gradeChild.procedureValue,
            serviceValue: gradeChild.serviceValue,
            advice: gradeChild.advice,
            recordId: this.recordId,
          })
          .then((res) => {
            this.gradeShow = false;
          });
      }
    },
    viewPrescription(orderId) {
      // console.log("orderId", orderId);
      this.$router.push({
        path: '/diagnoseDetail',
        query: {
          orderId: orderId,
          type: 'patient',
        },
      });
    },
    restInfo(info) {
      let obj = JSON.parse(info.data);
      return obj;
    },
    toolShow(item) {
      if (item.ID == this.toggleID) {
        if (item.type == 'TIMCustomElem' && this.restInfo(item.payload).type == '4') {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    test() {
      let text = document.querySelector('.title').textContent;
      let parts = text.split('/');
      var index = parseInt(parts[0], 10);
      if (this.picList[index - 1].type == 'image/jpeg') {
        wx.previewImage({
          current: this.picList[index - 1].thumbnail, // 当前显示图片的http链接
          urls: [this.picList[index - 1].thumbnail], // 需要预览的图片http链接列表
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import './style/index.scss';

.TUIChat {
  .TUI-message-list {
    background-color: #f6f6f6;
  }

  .viewPic {
    position: fixed;
    color: #909399;
    z-index: 999999;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
    border: 1px solid #909399;
    padding: 2px;
    border-radius: 10%;
  }

  .ai-tip {
    font-size: 10px;
    font-weight: normal;
    line-height: 17px;
    text-align: center;
    letter-spacing: 0.2px;
    color: #999999;
  }

  .ai-control-btn {
    display: flex;
    align-items: center;
    margin-top: 8px;

    span {
      font-size: 11px;
      font-weight: normal;
      text-align: center;
      letter-spacing: 0.2px;
      color: #666666;
      box-sizing: border-box;
      border: 0.5px solid #999999;
      border-radius: 16px;
      padding: 0 8px;
    }
  }

  .graphic-list {
    position: fixed;
    right: 10px;
    top: 10vh;
  }
}
</style>
<style lang="scss">
.TUIChat {
  .TUIChat-main {
    .ai-control-btn {
      .van-divider {
        width: 100%;

        .van-divider--content-center::before {
          margin-right: 0px;
        }

        .van-divider--content-center::after {
          margin-left: 0px;
        }
      }
    }
  }
}
</style>