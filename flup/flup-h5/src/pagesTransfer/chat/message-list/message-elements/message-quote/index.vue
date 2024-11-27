<template>
  <div
    v-if="quoteContent"
    class="reference-content"
    :class="props.message.flow === 'in' || 'reverse'"
    @click="scrollToOriginalMessage"
  >
    <div class="max-double-line">
      {{ quoteContent.messageSender }}: {{ quoteContent.messageAbstract }}
    </div>
  </div>
</template>
 <script>
 import {
  TUIStore,
  StoreName,
} from "@tencentcloud/chat-uikit-engine";
export default {
  props: {
    message: {
      type:Object,
      default:() => ({}),
    },
  },
  data() {
    return {
      selfAddValue: 0,
      messageList: [],
    };
  },
  computed: {
    quoteContent() {
      const cloudCustomData = JSON.parse(this.message.cloudCustomData || "{}");
      return cloudCustomData.messageReply;
    },
  },
  mounted() {
    TUIStore.watch(StoreName.CHAT, {
      messageList(list) {
        this.messageList = list;
      },
    });
  },
  methods: {
    scrollToOriginalMessage(){

    }
  },
};
</script>
<style lang="scss" scoped>
.reference-content {
  max-width: 272px;
  margin-top: 4px;
  margin-left: 44px;
  padding: 12px;
  font-size: 12px;
  color: #666;
  word-wrap: break-word;
  word-break: break-all;
  background-color: #fbfbfb;
  border-radius: 8px;
  line-height: 16.8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.reverse {
  margin-left: auto;
  margin-right: 44px;
}

.max-double-line {
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  max-height: 33px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.reverse {
  .reference-content {
    margin-right: 44px;
    margin-left: auto;
  }
}
</style>
