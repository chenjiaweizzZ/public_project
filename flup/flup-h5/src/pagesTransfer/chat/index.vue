<template>
  <div class="TUI-chat TUI-chat-h5">
    <MessageList
      :class="['TUI-chat-message-list', 'TUI-chat-h5-message-list']"
      :isGroup="isGroup"
      :groupID="groupID"
      @handleEditor="handleEditor"
      @iptBlur="iptBlur"
      ref="MessageList"
    >
    </MessageList>
    <MessageInput
      :class="[
        'TUI-chat-message-input',
        'TUI-chat-h5-message-input',
        'TUI-chat-uni-message-input',
      ]"
      ref="messageInputRef"
      :isMuted="false"
      muteText="您已被管理员禁言"
      placeholder="请输入消息"
      @handleToolbarListShow="handleToolbarListShow"
      v-if="!isDisabled && graphicSustain"
    ></MessageInput>
    <MessageInputToolbar
      v-if="!isDisabled && isToolbarShow"
      :class="[
        'TUI-chat-message-input-toolbar',
        'TUI-chat-h5-message-input-toolbar',
      ]"
      @insertEmoji="insertEmoji"
      @iptBlur="iptBlur"
      :preSales="preSales"
    ></MessageInputToolbar>
    <!-- <chat-script v-if="scriptShow"></chat-script> -->
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import MessageList from "./message-list/index.vue";
import MessageInput from "./message-input/index.vue";
import MessageInputToolbar from "./message-input-toolbar/index.vue";
import utils from "@/utils/utils.js";
import chatScript from './chatScript.vue';
export default {
  name:'chat',
  components: {
    MessageList,
    MessageInput,
    MessageInputToolbar,
    chatScript
  },
  data() {
    return {
      isGroup: false,
      groupID: "",
      isToolbarShow: false,
      consultId:'',
      serviceStatus:0,//订单状态
      preSalesId: '',
      preSales: 0,
      scriptShow: false
    };
  },
  computed: {
    ...mapState('chat',['isLogin','isDisabled','toBottom','graphicSustain']),
  },
  watch: {
    toBottom: function(newValue) {
      if(newValue) {
        this.bottomScroll()
        this.setToBottom(false)
      }
    }
  },
  async mounted(){
    let userID = this.$chat.getLoginUser();
    if(userID) {
      await this.$chat.logout()
    }
    if(window.globalURL.ICDMApiUrl == 'https://premisd.zwjk.com/flup/api') {
      this.scriptShow = true
    }
    if(this.$route.query.preSales == 1){
      this.getPersonalGroupUserInfoList({
        roomId:this.$route.query.roomId,
      })
      this.preSales = 1 //售前
      let { retData } = await this.$apis.preSalesConsultation({isRemind: true})
      this.preSalesId = retData.id
    }else{
      if(this.$route.query.packageType == 1) {
        this.getGraphicGroupUserInfoList({
          roomId:this.$route.query.roomId,
        })
      }else {
        this.getGroupUserInfoList({
        roomId:this.$route.query.roomId,
      })
      }
    }
    this.serviceStatus = this.$route.query.serviceStatus;
    this.consultId = this.$route.query.consultId;
    if(this.serviceStatus == 2){
      this.setIsDisabled(true);
      await this.getHistoryQuery({
        roomId:this.$route.query.roomId,
        enddate:utils.formatDate(new Date(),'YYYY-MM-DD HH:mm:ss')
      });
      this.loginChat({
        userID:localStorage.getItem("userId"),
        userSig:localStorage.getItem("userSig"),
      })
      this.getConsultDetailsById();
      this.bottomScroll()
    }else{
      this.setIsDisabled(false);
      console.log('userId,userSig',localStorage.getItem("userId"),localStorage.getItem("userSig"))
      await this.getConsultDetailsById();
      this.loginChat({
        userID:localStorage.getItem("userId"),
        userSig:localStorage.getItem("userSig"),
      })
      
    }
  },
  beforeDestroy() {
    // if(!this.isDisabled){
    //   this.$chat.logout();
    // }
    this.readMessageCallback();
    this.restInfo();
    localStorage.removeItem('roomId')
  },
  methods: {
    ...mapMutations('chat',['UpdateMessageList','putMessage','restInfo','setNextReqMessageID','setIsCompleted','setIsLogin','setIsDisabled','setReferralStatus','setAiEnable',"setRoomId",
      "setInviteId",
      "setInviteShow",
      "setInviteShowType",
      "setCallName",
      "setToBottom",
      "setManagerId",
      "setGraphicSustain"]),
    ...mapActions('chat',['loginChat','getHistoryQuery','getGroupUserInfoList','getPersonalGroupUserInfoList','getGraphicGroupUserInfoList']),
    async getConsultDetailsById(){
      if(this.$route.query.preSales == 1) {
        let res = await this.$apis.getPersonalConsultDetailsById({personalConsultId:this.consultId});
          if(res.retData){
            this.setReferralStatus(res.retData.referralStatus)
            this.setManagerId(res.retData.managerId)
            this.setAiEnable(res.retData.aiEnabled == '1' ? true : false)
          }else{
            this.setReferralStatus(false)
          }
      }else {
        let res = await this.$apis.getConsultDetailsById({consultId:this.consultId});
          if(res.retData){
            this.setReferralStatus(res.retData.referralStatus)
            this.setManagerId(res.retData.managerId)
            if(res.retData.managerId == 'graphic') {
              if(res.retData.referralStatus == false) {
                this.setIsDisabled(true)
              }
              this.selectConsultGraphicDetail(res.retData.orderSerialNo)
            }
            this.setAiEnable(res.retData.aiEnabled == '1' ? true : false)
          }else{
            this.setReferralStatus(false)
          }
      }
    },
    selectConsultGraphicDetail(orderSerialNo) {
      this.$apis.selectConsultGraphicDetail(orderSerialNo).then(res => {
        let { retData } = res
        this.setGraphicSustain(retData.consultationTimes)
      })
    },
    iptBlur() {
      if(this.$refs.messageInputRef) {
        this.$refs.messageInputRef.switchEmojiAndFeature('');
      }
    },
    handleEditor(message, type) {
      if (!message || !type) return;
      switch (type) {
        case "reference":
          // todo
          break;
        case "reply":
          // todo
          break;
        case "reedit":
          console.log(111);
          break;
        default:
          break;
      }
    },
    handleToolbarListShow(show) {
      this.isToolbarShow = show !== "" ? show : !this.isToolbarShow;
      this.$refs.MessageList.scrollToTargetInWeb();
    },
    insertEmoji(emojiObj) {
      this.$refs.messageInputRef.insertEmoji(emojiObj);
    },
    bottomScroll(){
      setTimeout(() => {
        this.$refs.MessageList.scrollToTargetInWeb();
      },50)
    },
    async readMessageCallback(){
      if(this.preSales){
        await this.$apis.personalReadMessageCallback({
          personalConsultId: this.preSalesId
        })
      }else {
        await this.$apis.readMessageCallback({
          consultId:this.consultId
        })
      } 
    },
  },
};
</script>
<style scoped lang="scss">
@import "./style/index.scss";
.TUI-chat-uni-message-input {
  height: auto !important;
  padding: 10px 10px 0;
  border-top: 1px solid #eee;
}
</style>