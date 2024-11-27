<template>
  <div :class="['emoji-picker', 'emoji-picker-h5']" ref="emojiPickerDialog">
    <ul
      :class="['emoji-picker-list', 'emoji-picker-h5-list']"
      ref="emojiPickerListRef"
    >
      <li
        class="emoji-picker-list-item"
        v-for="(childrenItem, childrenIndex) in currentEmojiList"
        :key="childrenIndex"
        @click="select(childrenItem, childrenIndex)"
      >
        <img
          v-if="currentTabItem.type === EMOJI_TYPE.BASIC"
          class="emoji"
          :src="currentTabItem.url + handbasicEmojiMap(childrenItem)"
        />
        <img
          v-else-if="currentTabItem.type === EMOJI_TYPE.BIG"
          class="emoji-big"
          :src="currentTabItem.url + childrenItem + '@2x.png'"
        />
        <img
          v-else
          class="emoji-custom"
          :src="currentTabItem.url + childrenItem"
        />
      </li>
    </ul>
    <ul class="emoji-picker-tab">
      <li
        class="emoji-picker-tab-item"
        v-for="(item, index) in list"
        :key="index"
        @click="toggleEmojiTab(index)"
      >
        <Icon
          v-if="item.type === EMOJI_TYPE.BASIC"
          class="icon"
          :file="getfaceIcon()"
        ></Icon>
        <img
          v-else-if="item.type === EMOJI_TYPE.BIG"
          class="icon-big"
          :src="item.url + item.list[0] + '@2x.png'"
        />
        <img v-else class="icon-custom" :src="item.url + item.list[0]" />
      </li>
      <li class="send-btn" @click="sendMessage">发送</li>
    </ul>
  </div>
</template>
<script>
import { emojiList, basicEmojiMap } from "../../utils/emojiList";
import { TUIGlobal } from "@tencentcloud/chat-uikit-engine";
import faceIcon from "../../assets/icon/face.png";
import Icon from "../../common/Icon.vue";
export default {
  components: {
    Icon,
  },
  data() {
    return {
      roomId: "",
      consultId: "",
      list: [],
      currentTabIndex: 0,
      currentTabItem: {},
      currentEmojiList: [],
      currentConversation: {},
      EMOJI_TYPE: {
        BASIC: "basic",
        BIG: "big",
        CUSTOM: "CUSTOM",
      },
    };
  },
  computed: {
    isUniFrameWork() {
      return TUIGlobal.global.window ? false : true;
    },
  },
  mounted() {
    this.roomId = this.$route.query.roomId;
    this.consultId = this.$route.query.consultId;
    this.list = JSON.parse(JSON.stringify(emojiList));
    this.currentTabItem = this.list[0];
    this.currentEmojiList = this.list[0].list;
  },
  methods: {
    toggleEmojiTab(index) {
      console.log(1122, index);
      this.currentTabIndex = index;
      this.currentTabItem = this.list[index];
      this.currentEmojiList = this.list[index].list;
      // 滚动条回滚到顶部
      // 原生 web & h5
      this.$refs.emojiPickerListRef &&
        (this.$refs.emojiPickerListRef.scrollTop = 0);
    },
    select(item, index) {
      const options = {
        name: item,
        type: this.currentTabItem.type,
      };
      switch (this.currentTabItem.type) {
        case this.EMOJI_TYPE.BASIC:
          options.url = this.currentTabItem.url + basicEmojiMap[item];
          this.$emit("insertEmoji", options);
          break;
        case this.EMOJI_TYPE.BIG:
          this.sendFaceMessage(index, this.currentTabItem);
          break;
        case this.EMOJI_TYPE.CUSTOM:
          this.sendFaceMessage(index, this.currentTabItem);
          break;
        default:
          break;
      }
    },
    sendFaceMessage(index, listItem) {
    },
    handbasicEmojiMap(item) {
      return basicEmojiMap[item];
    },
    getfaceIcon() {
      return faceIcon;
    },
    sendMessage() {
      this.$emit("sendMessage");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style/index.scss";
</style>
