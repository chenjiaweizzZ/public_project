 
<template>
  <div class="message-bubble">
    <!-- todo 统一组件处理-->
    <div
      :class="[messageItem.flow === 'in' ? '' : 'reverse',!(messageItem.type == 'TIMCustomElem' && !(restInfo(messageItem.payload).type == 3 || restInfo(messageItem.payload).type == 2 || restInfo(messageItem.payload).type == 5 || restInfo(messageItem.payload).type == 6 || restInfo(messageItem.payload).type == 7 || restInfo(messageItem.payload).type == 9 || restInfo(messageItem.payload).type == 12 || restInfo(messageItem.payload).type == 13)) ?'message-bubble-main-content':'']"
    >
      <img
        class="message-avatar"
        :src="messageItem.avatar || defaultAvatarUrl"
        onerror="this.src=defaultAvatarUrl"
        v-if="!(messageItem.type == 'TIMCustomElem' && !(restInfo(messageItem.payload).type == 3 || restInfo(messageItem.payload).type == 2 || restInfo(messageItem.payload).type == 5 || restInfo(messageItem.payload).type == 6 || restInfo(messageItem.payload).type == 9 || restInfo(messageItem.payload).type == 12 || restInfo(messageItem.payload).type == 13))"
      />
      <img class="message-avatar" src="@/assets/images/chat/ai.png" v-if="messageItem.type == 'TIMCustomElem' && restInfo(messageItem.payload).type == 7">
      <main class="message-body" :class="{ 'message-body-out': messageItem.flow === 'out'}">
        <div
          v-if="messageItem.flow === 'in' && messageItem.conversationType === 'GROUP' && userInfoNick[messageItem.from] && !(messageItem.type == 'TIMCustomElem' && !(restInfo(messageItem.payload).type == 3 || restInfo(messageItem.payload).type == 2 || restInfo(messageItem.payload).type == 5 || restInfo(messageItem.payload).type == 6 || restInfo(messageItem.payload).type == 9 || restInfo(messageItem.payload).type == 12 || restInfo(messageItem.payload).type == 13))"
          class="message-body-nickName"
        >
        {{ userInfoNick[messageItem.from].roleName + userInfoNick[messageItem.from].userName }}
        </div>
        <div
          v-if="messageItem.flow === 'out' && messageItem.conversationType === 'GROUP' && userInfoNick[messageItem.from] && !(messageItem.type == 'TIMCustomElem' && !(restInfo(messageItem.payload).type == 3 || restInfo(messageItem.payload).type == 2 || restInfo(messageItem.payload).type == 5 || restInfo(messageItem.payload).type == 6 || restInfo(messageItem.payload).type == 9 || restInfo(messageItem.payload).type == 12 || restInfo(messageItem.payload).type == 13))"
          class="message-body-nickName2"
        >
        {{ userInfoNick[messageItem.from].roleName + userInfoNick[messageItem.from].userName }}
        </div>
        <div class="message-body-nickName" v-if="messageItem.type == 'TIMCustomElem' && restInfo(messageItem.payload).type == 7">
          小雅机器人
        </div>
        <div
          :class="[
            'blink',
            messageItem.type != 'TIMSoundElem' ? 'message-body-content':'',
            (messageItem.type === 'TIMCustomElem' && restInfo(messageItem.payload).type == 13) || messageItem.type === 'TIMTextElem' || messageItem.type === 'TIMSoundElem'  ? messageItem.flow === 'out' ? 'content-out' : 'content-in' :'',
            isNoPadding ? 'content-noPadding' : '',
            isNoPadding && isBlink ? 'blink-shadow' : '',
            !isNoPadding && isBlink ? 'blink-content' : '',
            (messageItem.type == 'TIMCustomElem' && (restInfo(messageItem.payload).type == 3 || restInfo(messageItem.payload).type == 2 || restInfo(messageItem.payload).type == 5 || restInfo(messageItem.payload).type == 6 || restInfo(messageItem.payload).type == 9 || restInfo(messageItem.payload).type == 12))?'TIMCustomElem-WJDC':'',
            (messageItem.type == 'TIMCustomElem' && restInfo(messageItem.payload).type == 7) ? 'content-in' : '',
          ]"
        >
          <slot></slot>
        </div>
        <!-- <div class="message-body-aitip" v-if="messageItem.type == 'TIMCustomElem' && restInfo(messageItem.payload).type == 7">以上内容由AI提供,仅供参考,如需专业建议,可咨询个管师或医护团队。</div> -->
      </main>
      <div class="message-bubble__icons" v-if="messageItem.flow === 'out'">
        <!-- 发送失败 -->
        <div
          v-if="messageItem.status === 'fail'"
          class="message-label fail"
          @click="resendMessage()"
        >
          !
        </div>
        <!-- 加载图标 -->
        <van-loading v-if="
            messageItem.status === 'unSend' &&
            needLoadingIconMessageType.includes(messageItem.type)" 
           size="20" />
        <!-- 已读 & 未读 -->
      </div>
      
    </div>
  </div>
</template>
<script>
import TUIChatEngine from "@tencentcloud/chat-uikit-engine";
import Icon from "../../common/Icon.vue";
import MessageQuote from "./message-quote/index.vue";
import loadingIcon from "../../assets/icon/loading.png";
import { mapState } from "vuex";
import { List } from 'vant';
import mixin  from "../../mixin";
import { Loading } from 'vant';
import avatarUrl from '@/assets/images/avatar.png';
import avatarUrl1 from '@/assets/images/avator1.png';
import avatarUrl2 from '@/assets/images/avator2.png';
export default {
  components:{
    Icon,
    MessageQuote,
    loadingIcon,
    [Loading.name]: Loading
  },
  mixins:[mixin],
  props: {
    messageItem: {
      type:Object,
      default:() => ({})
    },
    content: {
      type:Object,
      default:() => ({})
    },
    blinkMessageIDList: {
      type:Array,
      default:() => []
    },
  },
  data() {
    return {
      TYPES: TUIChatEngine.TYPES,
    };
  },
  computed: {
    ...mapState('chat',['groupUserInfoList']),
    isNoPadding() {
      return [this.TYPES.MSG_IMAGE, this.TYPES.MSG_VIDEO].includes(
        this.messageItem.type
      );
    },
    isBlink() {
      if (this.messageItem.ID) {
        return this.blinkMessageIDList.includes(this.messageItem.ID);
      }
      return false;
    },
    needLoadingIconMessageType(){
      return [
        this.TYPES.MSG_LOCATION,
        this.TYPES.MSG_TEXT,
        this.TYPES.MSG_CUSTOM,
        this.TYPES.MSG_MERGER,
        this.TYPES.MSG_FACE,
        this.TYPES.MSG_IMAGE
      ]
    },
    userInfoNick(){
      let obj = this.groupUserInfoList.reduce((total,item)=>{
        total[item.extendUserId] = item;
        return total
      },{})
      return obj;
    },
    defaultAvatarUrl(){
      if(this.messageItem.flow === 'in') {
        return avatarUrl1;
      }else {
        return avatarUrl2;
      }
    }
  },
  methods: {
    resendMessage() {
      this.$emit("resendMessage",this.content);
    },

    blinkMessage(messageID) {
      this.$emit("blinkMessage", messageID);
    },

    scrollTo(scrollHeight) {
      this.$emits("scrollTo", scrollHeight);
    },
  },
};
</script>
<style lang="scss" scoped>
.reverse {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
}
.message-bubble {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;

  .message-bubble-main-content {
    display: flex;

    .message-avatar {
      display: block;
      width: 36px;
      height: 36px;
      border-radius: 5px;
      flex: 0 0 auto;
    }

    .message-body {
      display: flex;
      flex: 0 1 auto;
      flex-direction: column;
      align-items: flex-start;
      margin: 0 14px;
      max-width: calc(100% - 100px);

      .message-body-nickName {
        margin-bottom: 4px;
        font-size: 10px;
        color: #999;
      }

      .message-body-nickName2 {
        margin-bottom: 4px;
        font-size: 10px;
        color: #999;
        float: right;
      }

      .message-body-aitip {
        font-size: 10px;
        font-weight: normal;
        line-height: 17px;
        text-align: center;
        letter-spacing: 0.2px;
        color: #999999;
      }

      .message-body-content {
        padding: 8px 12px;
        font-size: 14px;
        color: #000;
        letter-spacing: 0;
        word-wrap: break-word;
        word-break: break-all;
        position: relative;
        // overflow: hidden;
      }
      .content-in {
        background: #FFFFFF;
        border-radius: 8px;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          left:-5px;
          top:5px;
          z-index: 1;
          width: 12px;
          height: 10px;
          background-image: url('../../../../assets/images/mk.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      .content-out {
        background: rgb(50,174,87);
        border-radius: 8px;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          right:-5px;
          top:5px;
          z-index: 1;
          width: 12px;
          height: 10px;
          background-image: url('../../../../assets/images/mk2.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      .TIMCustomElem-WJDC{
        border-radius: none;
        background-color: transparent;
        padding: 0;
      }
      .content-noPadding {
        padding: 0px;
        background: transparent;
        border-radius: 10px;
        overflow: hidden;
      }
      .blink-shadow {
        @keyframes shadowBlink {
          50% {
            box-shadow: rgba(255, 156, 25, 1) 0px 0px 10px 0px;
          }
        }
        box-shadow: rgba(255, 156, 25, 0) 0px 0px 10px 0px;
        animation: shadowBlink 1s linear 3;
      }

      .blink-content {
        @keyframes referenceBlink {
          50% {
            background-color: #ff9c19;
          }
        }
        animation: referenceBlink 1s linear 3;
      }
    }

    .message-body-out {
      align-items: end;
    }

    .message-label {
      align-self: flex-end;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #b6b8ba;
      word-break: keep-all;
      flex: 0 0 auto;

      &.fail {
        width: 15px;
        height: 15px;
        border-radius: 15px;
        background: red;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      &.loadingCircle {
        opacity: 0;
        animation: circleLoading 2s linear 1s infinite;
      }

      &.unRead {
        color: #679ce1;
      }

      @keyframes circleLoading {
        0% {
          transform: rotate(0);
          opacity: 1;
        }

        100% {
          opacity: 1;
          transform: rotate(360deg);
        }
      }
    }
  }

  .message-bubble-extra-content {
    display: flex;
  }
  &__icons{
    height: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
