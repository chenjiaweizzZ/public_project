<template>
  <ToolbarItemContainer
    :iconFile="faceIcon"
    title="表情"
    @onIconClick="onIconClick"
    @onDialogClose="onDialogClose"
    ref="container"
  >
    <EmojiPickerDialog
      @insertEmoji="insertEmoji"
      @sendMessage="sendMessage"
      @onClose="onClose"
    ></EmojiPickerDialog>
  </ToolbarItemContainer>
</template>
<script>
import EmojiPickerDialog from "./emoji-picker-dialog.vue";
export default {
  components:{
    EmojiPickerDialog
  },
  data() {
    return {
      currentConversation: {},
    };
  },
  methods: {
    onIconClick(dialogRef) {
      this.$emit("dialogShowInH5", dialogRef.value);
    },
    onDialogClose(dialogRef) {
      this.$emit("dialogCloseInH5", dialogRef.value);
    },
    insertEmoji(emojiObj) {
      this.$emit("insertEmoji", emojiObj);
    },
    sendMessage() {
      this.$emit("sendMessage");
    },
    onClose() {
      this.$refs.container.toggleDialogDisplay(false);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style/index.scss";
</style>
