<template>
  <!--本地 icon 资源, uniapp 打包到 app 仅支持标签 image, 打包小程序和 H5 均可支持标签 img -->
  <div class="common-icon-container" @click="handlerImgClick">
    <image
      class="common-icon"
      :src="file"
      v-if="isApp"
      :style="{ width: width, height: height }"
    />
    <img
      class="common-icon"
      :src="file"
      v-else
      :style="{ width: width, height: height }"
    />
  </div>
</template>
<script>
import { TUIGlobal } from "@tencentcloud/chat-uikit-engine";
export default {
  name:'Icon',
  props: {
    file: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "20px",
    },
    height: {
      type: String,
      default: "20px",
    },
  },
  data() {
    return {
      isApp:TUIGlobal.getPlatform() === "app"
    };
  },
  methods: {
    handlerImgClick() {
      this.$emit("click");
    },
  },
};
</script>
<style lang="scss" scoped>
.common-icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
