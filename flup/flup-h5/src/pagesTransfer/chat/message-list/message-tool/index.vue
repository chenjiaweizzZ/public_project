<template>
  <div class="dialog-item" :class="'dialog-item-h5'" v-if="messageItem.flow == 'out'">
    <div class="dialog-item-list" :class="'dialog-item-list-h5'">
      <template v-for="(item, index) in actionItems">
        <div
          v-if="item.renderCondition()"
          class="list-item"
          @click="getFunction(index)"
          :key="index"
        >
          <Icon :file="item.iconUrl" width="15px" height="15px"></Icon>
          <span class="list-item-text">{{ item.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import Icon from "../../common/Icon.vue";
import { TUIGlobal } from "@tencentcloud/chat-uikit-engine";
// import { Toast, TOAST_TYPE } from "../../common/Toast/index";
import delIcon from "../../assets/icon/msg-del.svg";
import copyIcon from "../../assets/icon/msg-copy.svg";
import quoteIcon from "../../assets/icon/msg-quote.svg";
import revokeIcon from "../../assets/icon/msg-revoke.svg";
import forwardIcon from "../../assets/icon/msg-forward.svg";
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  components: {
    Icon,
  },
  data() {
    return {
      actionItems: [],
      message: {},
    };
  },
  props: {
    messageItem: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isUniFrameWork() {
      return TUIGlobal.global.window ? false : true;
    },
  },
  mounted() {
    console.log("this.messageItem",this.messageItem)
    let messageItemType = this.messageItem.type
    let flow = this.messageItem.flow
    this.actionItems = [
      // {
      //   text: "打开",
      //   iconUrl: copyIcon,
      //   renderCondition() {
      //     if (!this.message) return false;
      //   },
      //   clickEvent: this.openMessage,
      // },
      {
        text: "复制",
        iconUrl: copyIcon,
        renderCondition() {
          // if (!this.message) return true;
          if(messageItemType == "TIMTextElem")  return true
        },
        clickEvent: this.copyMessage,
      },
      {
        text: '撤回',
        iconUrl: revokeIcon,
        renderCondition() {
          // if (!this.message) return false;
          if(flow == "out")  return true
        },
        clickEvent: this.revokeMessage,
      },
      // {
      //   text: "删除",
      //   iconUrl: delIcon,
      //   renderCondition() {
      //     if (!this.message) return false;
      //   },
      //   clickEvent: this.deleteMessage,
      // },
      // {
      //   text: "转发",
      //   iconUrl: forwardIcon,
      //   renderCondition() {
      //     if (!this.message) return false;
      //   },
      //   clickEvent: this.forwardSingleMessage,
      // },
      // {
      //   text: "引用",
      //   iconUrl: quoteIcon,
      //   renderCondition() {
      //     if (!this.message) return false;
      //   },
      //   clickEvent: this.quoteMessage,
      // },
    ];
  },
  methods: {
    ...mapMutations('chat',['UpdatePicListAfterRevoked']),
    openMessage() {
      let url = "";
      switch (this.message.type) {
        case TUIChatEngine.TYPES.MSG_FILE:
          url = this.message.payload.fileUrl;
          break;
        case TUIChatEngine.TYPES.MSG_VIDEO:
          url = this.message.payload.remoteVideoUrl;
          break;
        case TUIChatEngine.TYPES.MSG_IMAGE:
          url = this.message.payload.imageInfoArray[0].url;
          break;
      }
      window.open(url, "_blank");
    },
    getFunction(index) {
      this.actionItems[index].clickEvent();
    },
    copyMessage() {
      this.copyContent(this.messageItem.payload.text);
    },
    copyContent(content) {
      let copyResult = true;
      const text = content || "";
      if (!!window.navigator.clipboard) {
        window.navigator.clipboard
          .writeText(text)
          .then((res) => {
            console.log("复制成功");
            return copyResult;
          })
          .catch((err) => {
            console.log("复制失败--采取第二种复制方案", err);
            this.copyContent2(text);
          });
      } else {
        this.copyContent2(text);
      }
    },
    copyContent2(content) {
      let copyResult = true;
      let inputDom = document.createElement("textarea");
      inputDom.setAttribute("readonly", "readonly");
      inputDom.value = text;
      document.body.appendChild(inputDom);
      inputDom.select();
      const result = document.execCommand("copy");
      if (result) {
        console.log("复制成功");
      } else {
        console.log("复制失败");
        copyResult = false;
      }
      document.body.removeChild(inputDom);
      return copyResult;
    },
    revokeMessage() {
      console.log("撤回",this.messageItem)
      let params = {
        roomId: this.$route.query.roomId,
        msgSeqList: this.messageItem.sequence
      }
      this.$apis.recallMsg(params).then(res => {
        if(this.messageItem.payload.description == "TIMImageElem" || this.messageItem.payload.description == "TIMVideoFileElem") {
          let url = ""
          if(this.messageItem.payload.description == "TIMImageElem") {
            url = JSON.parse(this.messageItem.payload.data).imageUrl
          }
          if(this.messageItem.payload.description == "TIMVideoFileElem") {
            url = JSON.parse(this.messageItem.payload.data).videoUrl
          }
          this.UpdatePicListAfterRevoked(url)
      }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/common.scss";
.dialog-item-web {
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  border: 1px solid #e0e0e0;
  padding: 12px 0;

  .dialog-item-list {
    display: flex;
    align-items: baseline;
    white-space: nowrap;
    justify-content: space-around;
    width: 100%;

    .list-item {
      padding: 4px 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .list-item-text {
        padding-left: 4px;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
}

.dialog-item-h5 {
  @extend .dialog-item-web;
  padding: 0;
  .dialog-item-list {
    flex-wrap: nowrap;
    margin: 10px;
    .list-item {
      padding: 0 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #4f4f4f;
      .list-item-text {
        padding-left: 0;
      }
    }
  }
}
</style>
