<template>
  <div class="imageContainer" @click.self="toggleShow" ref="skeletonDomRef">
    <!-- <img
      :class="['messageImage', 'messageImage-h5']"
      :src="content.url"
      :width="content.width"
      :height="content.height"
    /> -->
    <img
      :class="['messageImage', 'messageImage-h5']"
      :src="content.url"
      @load="onImageLoaded"
    />
  </div>
</template>
<script>
import { TUIGlobal } from "@tencentcloud/chat-uikit-engine";
import { handleSkeletonSize } from '../../utils/utils';
export default {
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
    messageItem: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isPC: TUIGlobal.getPlatform() === "pc",
    };
  },
  mounted() {
    if (this.messageItem.status === "success") {
      this.autoFixSkeletonSize();
    }
  },
  watch: {
    messageItem: {
      handler(newVal, oldVal) {
        if (newVal.status === "success" && newVal.status !== oldVal.status) {
          this.$emit("uploading");
        }
      },
      deep: true,
    },
    content: {
      handler(newVal, oldVal) {
        if (newVal.height > oldVal.height) {
          this.autoFixSkeletonSize();
        }
      },
      deep: true,
    },
  },
  methods: {
    autoFixSkeletonSize() {
      // const { width = 0, height = 0 } = this.content;
      // console.log('----',width,height)
      // if (width === 0 || height === 0) return;
      // const containerWidth = document.getElementById("app").clientWidth || 0;
      // const max = Math.min(containerWidth - 180, 300);
      // const size = handleSkeletonSize(width, height, max, max);
      // this.$refs.skeletonDomRef.style &&
      //   (this.$refs.skeletonDomRef.style.width = `${size.width}px`);
      // this.$refs.skeletonDomRef.style &&
      //   (this.$refs.skeletonDomRef.style.height = `${size.height}px`);
      this.$nextTick(() => {
        this.$emit("uploading");
      });
    },
    onImageLoaded(){
      this.$emit("uploading");
    },
    toggleShow() {
      if (this.messageItem.status === 'success' ||this.messageItem.progress === 1) {
        this.$emit("previewImage", this.messageItem);
      }
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/common.scss";

.imageContainer {
  overflow: hidden;
  background-color: #f4f4f4;
  .messageImage {
    max-width: calc(100vw - 180px);
    // max-height: calc(100vw - 180px);
    // width: 100%;
    // height: 100%;

    &-h5 {
      max-width: calc(100vw - 180px);
    }
  }
}
</style>